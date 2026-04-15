import { AlertCircle, CheckCircle2, Clock, Trash2, ChevronDown } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import type { SupportTicket, SupportStatus } from '@/types/store'
import { formatSupportStatusLabel } from '@/lib/formatUtils'
import { useAppStore } from '@/stores/useAppStore'
import { useCustomerStore } from '@/stores/useCustomerStore'
import { filterAndSortSupportTickets } from '@/lib/registryUtils'
import { toSafeArray } from '@/lib/filterUtils'
import { SUPPORT_STATUS_OPTIONS, SUPPORT_STATUS_UI_CONFIG } from '@/constants/statusOptions'
import { confirmWithToast } from '@/lib/toastConfirm'
import { toast } from 'sonner'

type SupportTabProps = {
  searchValue: string
  statusFilter: "all" | SupportStatus
}

const SupportTab = ({ searchValue, statusFilter }: SupportTabProps) => {
  const { supportTickets, fetchSupportTickets, updateSupportStatus, deleteSupportTicket } = useAppStore()
  const { customers, fetchAllCustomers } = useCustomerStore()

  useEffect(() => {
    void fetchSupportTickets()
    void fetchAllCustomers()

    const intervalId = window.setInterval(() => {
      void fetchSupportTickets()
    }, 20000)

    return () => window.clearInterval(intervalId)
  }, [fetchSupportTickets, fetchAllCustomers])

  const safeTickets = toSafeArray(supportTickets)
  const safeCustomers = toSafeArray(customers)
  const customerMap = useMemo(
    () => new Map(safeCustomers.map((customer) => [customer.email, customer])),
    [safeCustomers]
  )

  const filteredTickets = useMemo(
    () => filterAndSortSupportTickets(safeTickets, searchValue, statusFilter),
    [safeTickets, searchValue, statusFilter]
  )

  const iconMap = {
    alert: AlertCircle,
    clock: Clock,
    check: CheckCircle2,
  } as const

  const handleDeleteTicket = (ticketId: string) => {
    confirmWithToast({
      message: "Delete this concierge inquiry permanently?",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      onConfirm: async () => {
        const result = await deleteSupportTicket(ticketId)
        if (result.ok) {
          toast.success("Concierge inquiry deleted.")
          return
        }

        toast.error(result.message || "Could not delete concierge inquiry.")
      },
    })
  }

  const handleUpdateSupportStatus = async (ticketId: string, status: SupportStatus) => {
    const result = await updateSupportStatus(ticketId, status)
    if (result.ok) {
      toast.success(`Inquiry status updated to ${formatSupportStatusLabel(status)}.`)
      return
    }

    toast.error(result.message || "Could not update concierge inquiry status.")
  }

  return (
    <div className="animate-in fade-in duration-700 space-y-4 py-3 md:space-y-12 md:py-6 md:duration-1000">
      {/* Ticket Ledger */}
      <div className="space-y-3 md:space-y-6">
        {filteredTickets.length === 0 ? (
          <AdminEmptyState message="No support tickets found in this registry sector." />
        ) : (
          filteredTickets.map((ticket: SupportTicket) => {
            const config = SUPPORT_STATUS_UI_CONFIG[ticket.status] || { colorClassName: "text-muted-foreground", iconName: "clock" as const }
            const StatusIcon = iconMap[config.iconName]
            const customer = customerMap.get(ticket.customerEmail)

            return (
              <div 
                key={ticket.id} 
                className="group liquid-glass flex flex-col items-start justify-between gap-3 rounded-sm border border-border p-3 transition-all duration-300 hover:border-accent hover:shadow-editorial md:flex-row md:items-center md:gap-10 md:p-10 md:duration-700"
              >
                <div className="flex-1 space-y-2 border-none md:space-y-4 md:pr-8 md:border-r md:border-border/60">
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`w-5 h-5 ${config.colorClassName}`} />
                    <p className="break-all text-sm font-semibold leading-none tracking-tight text-foreground md:font-serif md:text-xl md:italic">
                        {ticket.customerEmail}
                    </p>
                  </div>

                  <div className="grid gap-1 text-[10px] text-muted-foreground md:grid-cols-2 md:text-[11px]">
                    <p>
                      Name: <span className="text-foreground/80">{customer?.profile.fullName || "Unknown"}</span>
                    </p>
                    <p>
                      Phone: <span className="text-foreground/80">{customer?.profile.phone || "N/A"}</span>
                    </p>
                    <p className="md:col-span-2">
                      Address: <span className="text-foreground/80">{customer?.profile.address || "N/A"}</span>
                    </p>
                  </div>

                  <p className="text-[12px] leading-relaxed text-muted-foreground md:text-sm">
                    {ticket.message}
                  </p>
                  <p className="text-[10px] font-semibold text-accent md:small-caps md:text-[9px] md:font-bold md:tracking-[0.2em]">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex w-full items-center gap-2 md:w-auto md:min-w-max md:gap-6">
                  <div className="flex flex-1 flex-wrap gap-1.5 md:hidden">
                    {SUPPORT_STATUS_OPTIONS.map((opt) => {
                      const isActive = opt === ticket.status
                      return (
                        <button
                          key={opt}
                          onClick={() => void handleUpdateSupportStatus(ticket.id, opt)}
                          className={`rounded-sm border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] transition-colors ${
                            isActive
                              ? "border-accent bg-accent/10 text-accent"
                              : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                          }`}
                        >
                          {formatSupportStatusLabel(opt)}
                        </button>
                      )
                    })}
                  </div>

                  <div className="relative hidden flex-1 md:flex-none md:block md:w-40">
                    <select
                      value={ticket.status}
                      onChange={(e) => void handleUpdateSupportStatus(ticket.id, e.target.value as SupportStatus)}
                      className="h-9 w-full cursor-pointer appearance-none border border-border bg-secondary/20 px-2 text-[10px] uppercase tracking-[0.08em] outline-none transition-all duration-300 focus:border-accent md:h-auto md:border-0 md:border-b md:bg-transparent md:py-2.5 md:text-sm md:tracking-widest md:duration-700"
                    >
                      {SUPPORT_STATUS_OPTIONS.map(opt => (
                        <option key={opt} value={opt} className="uppercase">{formatSupportStatusLabel(opt)}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/40 pointer-events-none" />
                  </div>
                  <button
                    onClick={() => handleDeleteTicket(ticket.id)}
                    className="rounded-sm bg-destructive/10 p-2.5 text-destructive transition-colors duration-300 hover:bg-destructive hover:text-destructive-foreground md:p-3 md:duration-500"
                    title="Delete Ticket"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default SupportTab
