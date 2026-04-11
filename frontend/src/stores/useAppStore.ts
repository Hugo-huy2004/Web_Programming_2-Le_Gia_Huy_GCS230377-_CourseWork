import { create } from 'zustand'
import type { SupportTicket, SupportStatus } from '../types/store'
import { supportTicketApiService } from '../services/supportTicketApiService'
import { formatUsd } from '../lib/formatUtils'

interface AppStoreState {
  supportTickets: SupportTicket[]
  fetchSupportTickets: () => Promise<void>
  addSupportTicket: (email: string, message: string) => Promise<{ ok: boolean; message: string }>
  updateSupportStatus: (ticketId: string, status: SupportStatus) => Promise<{ ok: boolean; message: string }>
  deleteSupportTicket: (ticketId: string) => Promise<{ ok: boolean; message: string }>
  formatUsd: (val: number) => string
}

export const useAppStore = create<AppStoreState>((set) => {
  return {
    supportTickets: [],

    fetchSupportTickets: async () => {
      try {
        const response = await supportTicketApiService.list()
        if (response.ok) {
          const tickets: SupportTicket[] = response.tickets.map((dto) => ({
            id: dto._id,
            customerEmail: dto.customerEmail,
            message: dto.message,
            status: dto.status as SupportStatus,
            createdAt: dto.createdAt,
          }))
          set({ supportTickets: tickets })
        }
      } catch (error) {
        console.error("Failed to fetch support tickets:", error)
      }
    },
    
    addSupportTicket: async (email: string, message: string) => {
      try {
        const response = await supportTicketApiService.create(email, message)
        if (response.ok) {
          const newTicket: SupportTicket = {
            id: response.ticket._id,
            customerEmail: response.ticket.customerEmail,
            message: response.ticket.message,
            status: response.ticket.status as SupportStatus,
            createdAt: response.ticket.createdAt,
          }
          set((state) => ({
            supportTickets: [...state.supportTickets, newTicket],
          }))
        }
        return { ok: response.ok, message: response.message }
      } catch (error) {
        console.error("Failed to create support ticket:", error)
        return { ok: false, message: error instanceof Error ? error.message : "Unknown error" }
      }
    },
    
    updateSupportStatus: async (ticketId: string, status: SupportStatus) => {
      try {
        const response = await supportTicketApiService.updateStatus(ticketId, status)
        if (response.ok) {
          set((state) => ({
            supportTickets: state.supportTickets.map((ticket) =>
              ticket.id === ticketId ? { ...ticket, status } : ticket
            ),
          }))
        }
        return { ok: response.ok, message: response.message }
      } catch (error) {
        console.error("Failed to update support status:", error)
        return { ok: false, message: error instanceof Error ? error.message : "Unknown error" }
      }
    },
    
    deleteSupportTicket: async (ticketId: string) => {
      try {
        const response = await supportTicketApiService.remove(ticketId)
        if (response.ok) {
          set((state) => ({
            supportTickets: state.supportTickets.filter((ticket) => ticket.id !== ticketId),
          }))
        }
        return { ok: response.ok, message: response.message }
      } catch (error) {
        console.error("Failed to delete support ticket:", error)
        return { ok: false, message: error instanceof Error ? error.message : "Unknown error" }
      }
    },
    
    formatUsd,
  }
})
