import { AlertCircle, CheckCircle2, Clock, Trash2, ChevronDown } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { AdminFilterBar } from '@/components/admin/AdminFilterBar'
import type { SupportTicket, SupportStatus } from '@/types/store'
import { formatSupportStatusLabel } from '@/lib/formatUtils'
import { useAppStore } from '@/stores/useAppStore'
import { useCustomerStore } from '@/stores/useCustomerStore'
import { filterSupportTickets } from '@/lib/registryUtils'
import { toSafeArray } from '@/lib/filterUtils'
import { SUPPORT_STATUS_OPTIONS, SUPPORT_STATUS_UI_CONFIG } from '@/constants/statusOptions'

const SupportTab = () => {
  const { supportTickets, fetchSupportTickets, updateSupportStatus, deleteSupportTicket } = useAppStore()
  const { customers, fetchAllCustomers } = useCustomerStore()
  const [ticketSearch, setTicketSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | SupportStatus>("all")

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
    () => filterSupportTickets(safeTickets, ticketSearch, statusFilter),
    [safeTickets, ticketSearch, statusFilter]
  )

  const iconMap = {
    alert: AlertCircle,
    clock: Clock,
    check: CheckCircle2,
  } as const

  return (
    <div className="space-y-12 py-6 animate-in fade-in duration-1000">
      
        <AdminFilterBar
        searchLabel="Search Support Ledger"
        searchPlaceholder="Customer Email or Message..."
        searchValue={ticketSearch}
        onSearchChange={setTicketSearch}
        statusLabel="Status Filter"
        statusValue={statusFilter}
        onStatusChange={(value) => setStatusFilter(value as SupportStatus | "all")}
        statusOptions={[
          { value: "all", label: "All Tickets" },
          ...SUPPORT_STATUS_OPTIONS.map((opt) => ({ value: opt, label: formatSupportStatusLabel(opt) })),
        ]}
        />

      {/* Ticket Ledger */}
      <div className="space-y-6">
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
                className="group bg-white border border-border p-8 md:p-10 rounded-sm hover:border-accent hover:shadow-editorial transition-all duration-700 flex flex-col md:flex-row gap-10 items-start md:items-center justify-between"
              >
                <div className="flex-1 space-y-4 pr-8 border-none md:border-r md:border-border/60">
                  <div className="flex items-center gap-3">
                    <StatusIcon className={`w-5 h-5 ${config.colorClassName}`} />
                    <p className="font-serif text-xl italic text-foreground leading-none tracking-tight">
                        {ticket.customerEmail}
                    </p>
                  </div>

                  <div className="grid gap-1 text-[11px] text-muted-foreground md:grid-cols-2">
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

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {ticket.message}
                  </p>
                  <p className="small-caps text-accent text-[9px] font-bold tracking-[0.2em]">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-6 min-w-max">
                  <div className="relative w-40">
                    <select
                      value={ticket.status}
                      onChange={(e) => updateSupportStatus(ticket.id, e.target.value as SupportStatus)}
                      className="w-full bg-secondary/20 border-b border-border py-2 text-sm focus:border-accent outline-none transition-all duration-700 uppercase tracking-widest text-[10px] appearance-none cursor-pointer"
                    >
                      {SUPPORT_STATUS_OPTIONS.map(opt => (
                        <option key={opt} value={opt} className="uppercase">{formatSupportStatusLabel(opt)}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/40 pointer-events-none" />
                  </div>
                  <button
                    onClick={() => deleteSupportTicket(ticket.id)}
                    className="p-3 bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-sm transition-colors duration-500"
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
