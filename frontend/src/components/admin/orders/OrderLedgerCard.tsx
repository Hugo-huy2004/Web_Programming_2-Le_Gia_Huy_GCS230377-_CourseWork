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
    <div className="group liquid-glass rounded-sm border border-border p-3 transition-all duration-300 hover:border-accent hover:shadow-editorial md:p-10 md:duration-700">
      <div className="flex flex-col items-start gap-3 md:gap-6 lg:flex-row lg:items-center lg:gap-10">
        <div className="space-y-1 md:space-y-2 lg:min-w-[180px]">
          <p className="text-[10px] font-semibold tracking-[0.08em] text-accent md:small-caps md:text-[9px] md:font-bold md:tracking-[0.2em]">
            {new Date(order.createdAt).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
          <h4 className="text-lg font-semibold uppercase tracking-tight text-foreground transition-colors group-hover:text-accent md:font-serif md:text-2xl md:tracking-tighter">
            {order.orderCode}
          </h4>
        </div>

        <div className="w-full flex-1 space-y-0.5 border-l border-border/60 pl-3 md:space-y-1 md:pl-8">
          <p className="text-sm font-semibold leading-none text-foreground md:font-serif md:text-xl md:italic">{order.receiverName}</p>
          <p className="text-[11px] lowercase tracking-tight text-muted-foreground md:text-[12px]">
            {order.customerEmail} • <span className="font-mono text-[10px]">{order.receiverPhone}</span>
          </p>
        </div>

        <div className="w-full space-y-0.5 text-left lg:min-w-[160px] lg:border-l lg:border-border/60 lg:pl-8 lg:text-right md:space-y-1">
          <p className="text-[10px] font-medium tracking-[0.08em] text-muted-foreground/60 md:small-caps md:text-[9px] md:font-bold md:tracking-[0.2em] md:text-muted-foreground/40">Acquisition Value</p>
          <p className="text-base font-semibold text-foreground md:font-serif md:text-2xl md:italic">{formatUsd(order.total)}</p>
        </div>

        <div className="flex w-full flex-col items-start justify-end gap-3 sm:flex-row sm:items-center sm:gap-6 lg:ml-auto lg:w-auto md:gap-4">
          <div className="w-full md:hidden">
            <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Status</p>
            <div className="flex flex-wrap gap-1.5">
              {orderStatusOptions.map((opt) => {
                const isActive = opt === order.status
                return (
                  <button
                    key={opt}
                    onClick={() => onUpdateOrderStatus(order.id, opt)}
                    className={`rounded-sm border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] transition-colors ${
                      isActive
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="relative hidden w-full sm:w-48 md:block">
            <div className={`pointer-events-none absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-2 ${config.colorClassName}`}>
              <StatusIcon className="h-3 w-3 md:h-3.5 md:w-3.5" />
            </div>
            <select
              value={order.status}
              onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
              className={`w-full appearance-none border-b border-border bg-transparent py-1.5 pl-5 text-[11px] font-semibold uppercase tracking-[0.08em] outline-none transition-all duration-300 focus:border-accent md:py-2 md:pl-6 md:font-serif md:text-xs md:font-bold md:italic md:tracking-[0.2em] md:duration-700 ${config.colorClassName}`}
            >
              {orderStatusOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-white text-foreground">
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground/40 md:h-3.5 md:w-3.5" />
          </div>

          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-start sm:gap-6">
            <button
              onClick={() => onExportInvoice(order)}
              className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.08em] text-foreground transition-colors hover:text-accent md:small-caps md:gap-2 md:font-bold md:tracking-[0.2em]"
            >
              <FileText className="h-3 w-3 md:h-3.5 md:w-3.5" />
              Invoice
            </button>
            <button
              onClick={() => onDeleteOrder(order.id)}
              className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.08em] text-destructive/60 transition-colors hover:text-destructive md:small-caps md:gap-2 md:font-bold md:tracking-[0.2em] md:text-destructive/40"
            >
              <Trash2 className="h-3 w-3 md:h-3.5 md:w-3.5" />
              Purge
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
