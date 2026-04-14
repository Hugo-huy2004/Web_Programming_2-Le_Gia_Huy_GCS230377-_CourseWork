import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import type { CustomerAccount, CustomerProfile } from '../types/store'
import {customerApiService,type CustomerDto,} from '../services/customerApiService'
import { loginCustomerWithGoogle } from '../services/googleAuthService'
import { useAuthStore } from './useAuthStore'
import type { CredentialResponse } from '@react-oauth/google'

interface CustomerStoreState {
  customers: CustomerAccount[]
  activeCustomerEmail: string | null
  activeCustomer: CustomerAccount | null

  setCustomers: (customers: CustomerAccount[]) => void
  setActiveCustomerEmail: (email: string | null) => void
  fetchAllCustomers: () => Promise<void>
  loginWithGoogle: (credential: CredentialResponse) => Promise<{ ok: boolean; message: string }>
  customerLogout: () => void
  updateCustomerProfile: (profile: CustomerProfile) => Promise<{ ok: boolean; message: string }>
  updateCustomerProfileByEmail: (email: string, profile: CustomerProfile) => Promise<{ ok: boolean; message: string }>
  updateCustomerLoyaltyPoints: (email: string, pointsDelta: number) => void
  updateCustomerSpending: (email: string, spentAmount: number) => void
  incrementCustomerOrders: (email: string) => void
}

export function hasCompleteCustomerProfile(customer: CustomerAccount | null | undefined): boolean {
  if (!customer) return false

  const fullName = String(customer.profile.fullName ?? "").trim()
  const birthday = String(customer.profile.birthday ?? "").trim()
  const phone = String(customer.profile.phone ?? "").trim()
  const address = String(customer.profile.address ?? "").trim()

  return Boolean(fullName && birthday && phone && address)
}

function mapCustomerDto(input: CustomerDto): CustomerAccount {
  return {
    email: input.email,
    profile: {
      fullName: input.profile.fullName,
      birthday: input.profile.birthday,
      phone: input.profile.phone,
      address: input.profile.address,
    },
    loyaltyPoints: Number(input.loyaltyPoints ?? 0),
    totalSpent: Number(input.totalSpent ?? 0),
    totalOrders: Number(input.totalOrders ?? 0),
  }
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

const storageWithExpiration: StateStorage = {
  getItem: (name: string): string | null => {
    const str = localStorage.getItem(name)
    if (!str) return null
    try {
      const item = JSON.parse(str)
      if (item.timestamp && Date.now() - item.timestamp > SEVEN_DAYS_MS) {
        localStorage.removeItem(name)
        return null
      }
      return str
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    const item = JSON.parse(value)
    item.timestamp = Date.now()
    localStorage.setItem(name, JSON.stringify(item))
  },
  removeItem: (name: string): void => {
    localStorage.removeItem(name)
  },
}

export const useCustomerStore = create<CustomerStoreState>()(
  persist(
    (set, get) => ({
      customers: [],
      activeCustomerEmail: null,
      activeCustomer: null,

      setCustomers: (customers: CustomerAccount[]) => {
        set((state) => {
          const activeCustomer = state.activeCustomerEmail
            ? customers.find((c) => c.email === state.activeCustomerEmail) ?? null
            : null

          return { customers, activeCustomer }
        })
      },

      setActiveCustomerEmail: (email: string | null) => {
        set((state) => ({
          activeCustomerEmail: email,
          activeCustomer: email
            ? state.customers.find((c) => c.email === email) ?? null
            : null,
        }))
      },

      fetchAllCustomers: async () => {
        try {
          const response = await customerApiService.list()
          const mapped = response.customers.map(mapCustomerDto)
          get().setCustomers(mapped)
        } catch (error) {
          console.error("[CustomerStore] Data synchronization failed:", error)
        }
      },

      loginWithGoogle: async (credential: CredentialResponse) => {
        try {
          const loginResult = await loginCustomerWithGoogle(credential)
          if (!loginResult.ok || !loginResult.customer) {
            return {
              ok: false,
              message: loginResult.message,
            }
          }

          const customer = loginResult.customer
          const mapped = mapCustomerDto(customer)

          set({
            customers: [mapped],
            activeCustomerEmail: mapped.email,
            activeCustomer: mapped,
          })

          if (loginResult.accessToken) {
            const auth = useAuthStore.getState()
            auth.clearSession()
            useAuthStore.setState({ accessToken: loginResult.accessToken })
          }

          return { ok: true, message: 'Login successful' }
        } catch (error) {
          return {
            ok: false,
            message: error instanceof Error ? error.message : 'Authentication failed',
          }
        }
      },

      customerLogout: () => {
        set({ customers: [], activeCustomerEmail: null, activeCustomer: null })
        useAuthStore.getState().clearSession()
      },


      updateCustomerProfile: async (profile: CustomerProfile) => {
        const { activeCustomerEmail, customers } = get()

        if (!activeCustomerEmail) {
          return { ok: false, message: 'Identity missing. Please login again.' }
        }

        const nextProfile: CustomerProfile = {
          fullName: profile.fullName.trim(),
          birthday: profile.birthday,
          phone: profile.phone.trim(),
          address: profile.address.trim(),
        }

        // Basic validation
        if (!nextProfile.fullName || !nextProfile.birthday || !nextProfile.phone || !nextProfile.address) {
          return { ok: false, message: 'All profile fields are required for registry.' }
        }

        try {
          // STEP 1: Send update request to the API
          const result = await customerApiService.updateProfile(activeCustomerEmail, nextProfile)

          // STEP 2: Update the local store with the new details
          const mapped = mapCustomerDto(result.customer)
          get().setCustomers([
            mapped,
            ...customers.filter((customer) => customer.email !== activeCustomerEmail),
          ])

          return { ok: true, message: "Profile synchronized successfully." }
        } catch (error) {
          return {
            ok: false,
            message: error instanceof Error ? error.message : 'Update failed.',
          }
        }
      },

      updateCustomerProfileByEmail: async (email: string, profile: CustomerProfile) => {
        const normalizedEmail = email.trim().toLowerCase()
        const { customers } = get()

        if (!normalizedEmail) {
          return { ok: false, message: 'Customer email is required.' }
        }

        const existing = customers.find((customer) => customer.email === normalizedEmail)

        const nextProfile: CustomerProfile = {
          fullName: profile.fullName.trim() || existing?.profile.fullName || "",
          birthday: profile.birthday.trim() || existing?.profile.birthday || "",
          phone: profile.phone.trim() || existing?.profile.phone || "",
          address: profile.address.trim() || existing?.profile.address || "",
        }

        if (!nextProfile.fullName && !nextProfile.birthday && !nextProfile.phone && !nextProfile.address) {
          return { ok: false, message: 'At least one profile field is required for update.' }
        }

        try {
          const result = await customerApiService.updateProfile(normalizedEmail, nextProfile)

          const mapped = mapCustomerDto(result.customer)
          get().setCustomers([
            mapped,
            ...customers.filter((customer) => customer.email !== normalizedEmail),
          ])

          return { ok: true, message: "Profile synchronized successfully." }
        } catch (error) {
          return {
            ok: false,
            message: error instanceof Error ? error.message : 'Update failed.',
          }
        }
      },

      updateCustomerLoyaltyPoints: (email: string, pointsDelta: number) => {
        const normalized = email.trim().toLowerCase()
        const { customers } = get()

        // Update local state immediately for better UX
        get().setCustomers(
          customers.map((customer) =>
            customer.email === normalized
              ? {
                ...customer,
                loyaltyPoints: Math.max(0, customer.loyaltyPoints + pointsDelta),
              }
              : customer
          )
        )


        // Sync with backend in the background
        customerApiService.updateMetrics(normalized, { pointsDelta }).catch((error) => {
          console.error('[metrics-sync-error]', error)
        })
      },

      updateCustomerSpending: (email: string, spentAmount: number) => {
        const normalized = email.trim().toLowerCase()
        const { customers } = get()

        get().setCustomers(
          customers.map((customer) =>
            customer.email === normalized
              ? {
                ...customer,
                totalSpent: Number((customer.totalSpent + spentAmount).toFixed(2)),
                totalOrders: customer.totalOrders + 1,
              }
              : customer
          )
        )

        customerApiService.updateMetrics(normalized, { spentDelta: spentAmount, ordersDelta: 1 }).catch((error) => {
          console.error('[metrics-sync-error]', error)
        })
      },

      incrementCustomerOrders: (email: string) => {
        const normalized = email.trim().toLowerCase()
        const { customers } = get()

        get().setCustomers(
          customers.map((customer) =>
            customer.email === normalized
              ? {
                ...customer,
                totalOrders: customer.totalOrders + 1,
              }
              : customer
          )
        )

        customerApiService.updateMetrics(normalized, { ordersDelta: 1 }).catch((error) => {
          console.error('[metrics-sync-error]', error)
        })
      },
    }),
    {
      name: 'customer-session',
      storage: createJSONStorage(() => storageWithExpiration),
      partialize: (state) => ({
        activeCustomerEmail: state.activeCustomerEmail,
        activeCustomer: state.activeCustomer,
      }),
    }
  ))
