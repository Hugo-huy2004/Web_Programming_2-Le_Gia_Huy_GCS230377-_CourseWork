import { create } from 'zustand'
import type { Voucher } from '../types/store'
import { voucherApiService } from '../services/voucherApiService'

interface VoucherStoreState {
  vouchers: Voucher[]
  setVouchers: (vouchers: Voucher[]) => void
  fetchVouchers: (includeAll: boolean) => Promise<void>
  createVoucher: (code: string, discountAmount: number) => Promise<{ ok: boolean; message: string }>
  toggleVoucherStatus: (voucherId: string) => Promise<void>
  deleteVoucher: (voucherId: string) => Promise<void>
  getVoucherByCode: (code: string) => Voucher | null
}

export const useVoucherStore = create<VoucherStoreState>((set, get) => {
  return {
    vouchers: [],
    setVouchers: (vouchers) => set({ vouchers }),
    fetchVouchers: async (includeAll) => {
      try {
        const result = await voucherApiService.list(includeAll)
        const mapped = result.vouchers.map((v) => ({
          id: v._id,
          code: v.code,
          discountAmount: Number(v.discountAmount ?? 0),
          active: Boolean(v.active),
          createdAt: v.createdAt,
        }))
        set({ vouchers: mapped })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown vouchers sync error'
        console.warn('[vouchers-sync-failed]', message)
        set({ vouchers: [] })
      }
    },
    createVoucher: async (code, amount) => {
      try {
        const normalizedCode = code.trim().toUpperCase()
        if (!normalizedCode || amount <= 0) {
          return { ok: false, message: 'Invalid voucher data.' }
        }
        const result = await voucherApiService.create(normalizedCode, amount)
        if (result.ok) {
          const { voucher } = result
          get().setVouchers([
            ...get().vouchers,
            {
              id: voucher._id,
              code: voucher.code,
              discountAmount: Number(voucher.discountAmount ?? 0),
              active: Boolean(voucher.active),
              createdAt: voucher.createdAt,
            },
          ])
        }
        return { ok: result.ok, message: result.message }
      } catch (error) {
        return { ok: false, message: error instanceof Error ? error.message : 'Failed to create voucher.' }
      }
    },
    toggleVoucherStatus: async (voucherId) => {
      try {
        const result = await voucherApiService.toggleStatus(voucherId)
        if (result.ok) {
          get().setVouchers(
            get().vouchers.map((v) =>
              v.id === voucherId ? { ...v, active: !v.active } : v
            )
          )
        }
      } catch (error) {
        console.error('[toggle-voucher-failed]', error)
      }
    },
    deleteVoucher: async (voucherId) => {
      try {
        const result = await voucherApiService.remove(voucherId)
        if (result.ok) {
          get().setVouchers(get().vouchers.filter((v) => v.id !== voucherId))
        }
      } catch (error) {
        console.error('[delete-voucher-failed]', error)
      }
    },
    getVoucherByCode: (code) => {
      const { vouchers } = get()
      const normalized = code.trim().toUpperCase()
      return vouchers.find((v) => v.code === normalized && v.active) ?? null
    },
  }
})