import { create } from 'zustand'
import type { StoreSettings, AdminAccount } from '../types/store'
import { storageKeys, defaultSettings, readStorage, writeStorage, mapSettingsDto } from '../lib/storeUtils'
import { settingsApiService } from '../services/settingsApiService'

interface SettingsStoreState {
  settings: StoreSettings
  admins: AdminAccount[]
  currentAdmin: string | null
  
  setSettings: (settings: StoreSettings) => void
  setAdmins: (admins: AdminAccount[]) => void
  setCurrentAdmin: (admin: string | null) => void
  fetchSettings: () => Promise<void>
  fetchAdmins: () => Promise<void>
  createAdminAccount: (username: string, password: string) => Promise<{ ok: boolean; message: string }>
  updateSettings: (next: Partial<StoreSettings>) => Promise<{ ok: boolean; message: string }>
}

export const useSettingsStore = create<SettingsStoreState>((set, get) => {
  const admins = readStorage<AdminAccount[]>(storageKeys.admins, [])
  const currentAdmin = readStorage<string | null>(storageKeys.currentAdmin, null)

  return {
    settings: defaultSettings,
    admins,
    currentAdmin,

    setSettings: (settings) => set({ settings }),
    setAdmins: (admins) => {
      set({ admins })
      writeStorage(storageKeys.admins, admins)
    },
    setCurrentAdmin: (admin) => {
      set({ currentAdmin: admin })
      writeStorage(storageKeys.currentAdmin, admin)
    },
    fetchSettings: async () => {
      try {
        const result = await settingsApiService.getSettings()
        set({ settings: mapSettingsDto(result.settings) })
      } catch (error) {
        console.error('[settings-sync-failed]', error)
      }
    },
    fetchAdmins: async () => {
      try {
        const result = await settingsApiService.listAdmins()
        const mappedAdmins = result.admins.map((admin): AdminAccount => ({
          id: admin.id,
          username: admin.username,
        }))
        get().setAdmins(mappedAdmins)
      } catch (error) {
        console.error('[admins-sync-failed]', error)
      }
    },
    createAdminAccount: async (username, password) => {
      try {
        const user = username.trim()
        const pass = password.trim()
        if (!user || !pass) {
          return { ok: false, message: 'Username and password are required.' }
        }
        const result = await settingsApiService.createAdmin(user, pass)
        if (result.ok) {
          get().setAdmins([...get().admins, { id: result.admin.id, username: result.admin.username }])
        }
        return { ok: result.ok, message: result.message }
      } catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : 'Failed to create admin account' }
      }
    },
    updateSettings: async (next) => {
      try {
        const result = await settingsApiService.updateSettings({
          shipperFee: next.shipperFee,
          dollarsPerPoint: next.dollarsPerPoint,
          minimumPointsToRedeem: next.minimumPointsToRedeem,
          pickupAddress: next.pickupAddress,
        })
        set({ settings: mapSettingsDto(result.settings) })
        return { ok: true, message: result.message }
      } catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : 'Failed to update settings.' }
      }
    },
  }
})