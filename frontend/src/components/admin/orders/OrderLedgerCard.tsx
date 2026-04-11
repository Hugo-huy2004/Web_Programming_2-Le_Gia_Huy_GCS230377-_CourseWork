import { AlertCircle, CheckCircle2, ChevronDown, Clock, FileText, Trash2, Truck } from "lucide-react"
import { ORDER_STATUS_UI_CONFIG } from "@/constants/statusOptions"
import type { Order, OrderStatus } from "@/types/store"

type OrderLedgerCardProps = {
  order: Order
  orderStatusOptions: readonly OrderStatus[]
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void
  onExportInvoice: (order: Order) => void
  onDeleteOrder: (orderId: string) => void
  formatUsd: (value: number) => string
}

const iconMap = {
  clock: Clock,
  check: CheckCircle2,
  truck: Truck,
  alert: AlertCircle,
} as const

export function OrderLedgerCard({
  order,
  orderStatusOptions,
  onUpdateOrderStatus,
  onExportInvoice,
  onDeleteOrder,
  formatUsd,
}: OrderLedgerCardProps) {
  const config = ORDER_STATUS_UI_CONFIG[order.status] || { colorClassName: "text-muted-foreground", iconName: "clock" as const }
  const StatusIcon = iconMap[config.iconName]

  return (
    <div className="group rounded-sm border border-border bg-white p-8 transition-all duration-700 hover:border-accent hover:shadow-editorial md:p-10">
      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:gap-10">
        <div className="space-y-2 lg:min-w-[180px]">
          <p className="small-caps text-[9px] font-bold tracking-[0.2em] text-accent">
            {new Date(order.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
          <h4 className="font-serif text-2xl uppercase tracking-tighter text-foreground transition-colors group-hover:text-accent">
            {order.orderCode}
          </h4>
        </div>

        <div className="w-full flex-1 space-y-1 border-l border-border/60 pl-4 md:pl-8">
          <p className="font-serif text-xl italic leading-none text-foreground">{order.receiverName}</p>
          <p className="text-[12px] lowercase tracking-tight text-muted-foreground">
            {order.customerEmail} • <span className="font-mono text-[10px]">{order.receiverPhone}</span>
          </p>
        </div>

        <div className="w-full space-y-1 text-left lg:min-w-[160px] lg:border-l lg:border-border/60 lg:pl-8 lg:text-right">
          <p className="small-caps text-[9px] font-bold tracking-[0.2em] text-muted-foreground/40">Acquisition Value</p>
          <p className="font-serif text-2xl italic text-foreground">{formatUsd(order.total)}</p>
        </div>

        <div className="flex w-full flex-col items-start justify-end gap-4 sm:flex-row sm:items-center sm:gap-6 lg:ml-auto lg:w-auto">
          <div className="relative w-full sm:w-48">
            <div className={`pointer-events-none absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-2 ${config.colorClassName}`}>
              <StatusIcon className="h-3.5 w-3.5" />
            </div>
            <select
              value={order.status}
              onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
              className={`w-full appearance-none border-b border-border bg-transparent py-2 pl-6 font-serif text-xs font-bold uppercase tracking-[0.2em] italic outline-none transition-all duration-700 focus:border-accent ${config.colorClassName}`}
            >
              {orderStatusOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-white text-foreground">
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40" />
          </div>

          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-start sm:gap-6">
            <button
              onClick={() => onExportInvoice(order)}
              className="small-caps flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-foreground transition-colors hover:text-accent"
            >
              <FileText className="h-3.5 w-3.5" />
              Invoice
            </button>
            <button
              onClick={() => onDeleteOrder(order.id)}
              className="small-caps flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-destructive/40 transition-colors hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Purge
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
