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
    <div className="animate-in fade-in space-y-6 md:space-y-10 duration-700">
      <div className="p-4 md:p-6 bg-secondary/30 rounded-sm border border-border flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <div className="h-10 w-10 bg-white border border-border rounded-full flex items-center justify-center font-serif italic text-accent shadow-sm">
            {memberOrders.length}
          </div>
          <div>
            <p className="small-caps text-[9px] text-muted-foreground">Portfolio Volume</p>
            <p className="font-serif italic text-sm text-foreground">Positions Held in Registry</p>
          </div>
        </div>
        <div className="hidden md:block h-px flex-1 mx-10 bg-border/40" />
        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-widest text-accent">Investment Ledger</p>
      </div>

      <div className="space-y-4">
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
              className="group liquid-glass bg-white border border-border rounded-sm hover:border-accent hover:shadow-sm transition-all duration-500 overflow-hidden cursor-pointer"
            >
              <div className="p-4 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-6">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="font-serif text-xl italic text-foreground tracking-tight">{order.orderCode}</p>
                    {isUnread && <span className="h-1 w-1 rounded-full bg-accent animate-ping" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-serif italic">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="md:px-10 md:border-l md:border-r border-border/40 space-y-1">
                  <p className="small-caps text-[9px] text-muted-foreground">Valuation</p>
                  <p className="font-serif text-lg italic text-foreground">{formatUsd(order.total)}</p>
                </div>

                <div className="md:px-10 space-y-1">
                  <p className="small-caps text-[9px] text-muted-foreground">Registry Status</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${getOrderStatusDotClass(order.status)}`}
                    />
                    <p className="font-serif text-[13px] italic text-foreground capitalize">{order.status}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    exportOrderInvoice(order)
                  }}
                  className="w-full md:w-auto px-6 md:px-8 py-3 border border-border rounded-sm text-[9px] font-bold uppercase tracking-[0.18em] md:tracking-widest hover:bg-foreground hover:text-background transition-all duration-500"
                >
                  Download Certificate
                </button>
              </div>

              <div className="bg-secondary/20 border-t border-border/40 px-4 md:px-8 py-3 flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-6">
                <p className="small-caps text-[8px] text-muted-foreground shrink-0">Pipeline</p>
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
                <p className="text-[9px] font-serif italic text-muted-foreground/60 capitalize text-left md:text-right">
                  {getOrderPipelineLabel(order.status)}
                </p>
              </div>

              {order.status === "cancelled" && (
                <div className="liquid-glass bg-destructive/5 px-8 py-3 border-t border-destructive/10 text-[10px] font-serif italic text-destructive text-center">
                  Registry Position Terminated - Asset Inventory Reverted
                </div>
              )}
            </motion.div>
          )
        })}

        {memberOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14 md:py-20 bg-white rounded-sm border border-dashed border-border text-center grayscale opacity-60 px-5">
            <p className="font-serif text-xl md:text-2xl tracking-tighter text-foreground italic mb-2">Archive is Empty</p>
            <p className="text-sm font-serif text-muted-foreground italic">No portfolio entries detected in the house ledger.</p>
          </div>
        )}
      </div>
    </div>
  )
}
