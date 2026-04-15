import { motion } from "framer-motion"
import { type Order } from "@/types/store"

interface CustomerOrderTabProps {
  memberOrders: Order[]
  formatUsd: (val: number) => string
  onNotify: (message: string) => void
  seenStatuses: Record<string, string>
  onMarkOrderAsSeen: (orderId: string) => void
  onExportInvoice: (order: Order) => void
}

const ORDER_PIPELINE_STEPS = ["pending", "confirmed", "shipping", "delivered"] as const

function getOrderProgressStep(status: string): number {
  return ORDER_PIPELINE_STEPS.indexOf(status as (typeof ORDER_PIPELINE_STEPS)[number])
}

function getOrderStatusDotClass(status: string): string {
  if (status === "delivered") return "bg-green-500"
  if (status === "shipping") return "bg-blue-400"
  if (status === "cancelled") return "bg-destructive"
  return "bg-accent"
}

function getOrderPipelineLabel(status: string): string {
  if (status === "pending") return "Registry Initiation"
  if (status === "confirmed") return "Verification Success"
  if (status === "shipping") return "Dispatch Processed"
  if (status === "cancelled") return "Registry Terminated"
  return "Acquisitions Complete"
}

export function CustomerOrderTab({
  memberOrders,
  formatUsd,
  onNotify,
  seenStatuses,
  onMarkOrderAsSeen,
  onExportInvoice,
}: CustomerOrderTabProps) {
  const exportOrderInvoice = (order: Order) => {
    onExportInvoice(order)
    onNotify(`Invoice exported: HWJ_Invoice_${order.orderCode}.pdf`)
  }

  const handleOrderCardActivate = (order: Order) => exportOrderInvoice(order)

  return (
    <div className="animate-in fade-in duration-700 space-y-3 md:space-y-10">
      <div className="rounded-sm border border-border bg-secondary/30 p-3 md:flex md:flex-row md:items-center md:justify-between md:gap-4 md:p-6">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white text-accent shadow-sm md:h-10 md:w-10 md:font-serif md:italic">
            {memberOrders.length}
          </div>
          <div>
            <p className="text-[10px] font-medium text-muted-foreground md:small-caps md:text-[9px]">Portfolio Volume</p>
            <p className="text-xs text-foreground md:font-serif md:italic md:text-sm">Positions Held in Registry</p>
          </div>
        </div>
        <div className="hidden md:block h-px flex-1 mx-10 bg-border/40" />
        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-accent md:mt-0 md:text-[10px] md:font-bold md:tracking-widest">Investment Ledger</p>
      </div>

      <div className="space-y-3 md:space-y-4">
        {memberOrders.map((order: Order, idx: number) => {
          const isUnread = seenStatuses[order.id] !== order.status
          const progress = getOrderProgressStep(order.status)

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              onMouseEnter={() => isUnread && onMarkOrderAsSeen(order.id)}
              onClick={() => handleOrderCardActivate(order)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleOrderCardActivate(order)
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Download invoice for order ${order.orderCode}`}
              className="group liquid-glass cursor-pointer overflow-hidden rounded-sm border border-border bg-white transition-all duration-300 hover:border-accent hover:shadow-sm md:duration-500"
            >
              <div className="flex flex-col gap-3 p-3 md:flex-row md:items-center md:justify-between md:gap-6 md:p-8">
                <div className="flex-1 space-y-0.5 md:space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold tracking-tight text-foreground md:font-serif md:text-xl md:italic">{order.orderCode}</p>
                    {isUnread && <span className="h-1 w-1 rounded-full bg-accent animate-ping" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground md:font-serif md:italic">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="space-y-0.5 md:space-y-1 md:border-l md:border-r md:border-border/40 md:px-10">
                  <p className="text-[10px] font-medium text-muted-foreground md:small-caps md:text-[9px]">Valuation</p>
                  <p className="text-sm font-semibold text-foreground md:font-serif md:text-lg md:italic">{formatUsd(order.total)}</p>
                </div>

                <div className="space-y-0.5 md:space-y-1 md:px-10">
                  <p className="text-[10px] font-medium text-muted-foreground md:small-caps md:text-[9px]">Registry Status</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${getOrderStatusDotClass(order.status)}`}
                    />
                    <p className="text-[12px] text-foreground capitalize md:font-serif md:text-[13px] md:italic">{order.status}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    exportOrderInvoice(order)
                  }}
                  className="w-full rounded-sm border border-border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.1em] transition-all duration-300 hover:bg-foreground hover:text-background md:w-auto md:px-8 md:py-3 md:text-[9px] md:font-bold md:tracking-widest md:duration-500"
                >
                  Download Certificate
                </button>
              </div>

              <div className="flex flex-col items-start gap-2 border-t border-border/40 bg-secondary/20 px-3 py-2 md:flex-row md:items-center md:gap-6 md:px-8 md:py-3">
                <p className="shrink-0 text-[10px] font-medium text-muted-foreground md:small-caps md:text-[8px]">Pipeline</p>
                <div className="flex-1 flex gap-1 h-[2px]">
                  {ORDER_PIPELINE_STEPS.map((step, sIdx) => (
                    <div
                      key={step}
                      className={`flex-1 rounded-full transition-all duration-1000 ${
                        sIdx <= progress ? "bg-accent" : "bg-border/20"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground/70 capitalize text-left md:text-right md:font-serif md:text-[9px] md:italic md:text-muted-foreground/60">
                  {getOrderPipelineLabel(order.status)}
                </p>
              </div>

              {order.status === "cancelled" && (
                <div className="liquid-glass border-t border-destructive/10 bg-destructive/5 px-4 py-2 text-center text-[10px] text-destructive md:px-8 md:py-3 md:font-serif md:italic">
                  Registry Position Terminated - Asset Inventory Reverted
                </div>
              )}
            </motion.div>
          )
        })}

        {memberOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border bg-white px-4 py-10 text-center opacity-60 md:px-5 md:py-20">
            <p className="mb-1 text-lg font-semibold tracking-tight text-foreground md:mb-2 md:font-serif md:text-2xl md:italic md:tracking-tighter">Archive is Empty</p>
            <p className="text-xs text-muted-foreground md:text-sm md:font-serif md:italic">No portfolio entries detected in the house ledger.</p>
          </div>
        )}
      </div>
    </div>
  )
}
