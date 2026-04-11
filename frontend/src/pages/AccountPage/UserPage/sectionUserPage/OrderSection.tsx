import { motion } from "framer-motion"
import { generateInvoice } from "../../../../lib/invoiceUtils"
import { useOrderStore } from "@/stores/useOrderStore"
import { useProductStore } from "@/stores/useProductStore"
import { type Order } from "@/types/store"
 
interface OrderSectionProps {
  memberOrders: Order[]
  formatUsd: (val: number) => string
  setStatusMessage: (msg: string) => void
}
 
export const OrderSection = ({
  memberOrders,
  formatUsd,
  setStatusMessage
}: OrderSectionProps) => {
  const { seenStatuses, markOrderAsSeen } = useOrderStore()
  const { products } = useProductStore()
 
  const orderProgressStep = (status: string) => {
    const steps = ["pending", "confirmed", "shipping", "delivered"]
    return steps.indexOf(status)
  }
 
  const exportOrderInvoice = (order: Order) => {
    generateInvoice(order, formatUsd, products)
    setStatusMessage(`Invoice exported: HWJ_Invoice_${order.orderCode}.pdf`)
  }
 
  return (
    <div className="animate-in fade-in space-y-10 duration-700">
      
      {/* Portfolio Info Bar */}
      <div className="p-6 bg-secondary/30 rounded-sm border border-border flex items-center justify-between">
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
         <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Investment Ledger</p>
      </div>
 
      <div className="space-y-4">
        {memberOrders.map((order: Order, idx: number) => {
          const isUnread = seenStatuses[order.id] !== order.status
          const progress = orderProgressStep(order.status)
 
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              onMouseEnter={() => isUnread && markOrderAsSeen(order.id)}
              className="group bg-white border border-border rounded-sm hover:border-accent hover:shadow-sm transition-all duration-500 overflow-hidden"
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* ID & Date */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <p className="font-serif text-xl italic text-foreground tracking-tight">{order.orderCode}</p>
                    {isUnread && <span className="h-1 w-1 rounded-full bg-accent animate-ping" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-serif italic">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
 
                {/* Valuation */}
                <div className="md:px-10 border-l border-border/40 md:border-l md:border-r space-y-1">
                   <p className="small-caps text-[9px] text-muted-foreground">Valuation</p>
                   <p className="font-serif text-lg italic text-foreground">{formatUsd(order.total)}</p>
                </div>
 
                {/* Status Badge */}
                <div className="md:px-10 space-y-1">
                   <p className="small-caps text-[9px] text-muted-foreground">Registry Status</p>
                   <div className="flex items-center gap-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-500' : 
                        order.status === 'shipping' ? 'bg-blue-400' : 
                        order.status === 'cancelled' ? 'bg-destructive' : 'bg-accent'
                      }`} />
                      <p className="font-serif text-[13px] italic text-foreground capitalize">{order.status}</p>
                   </div>
                </div>
 
                {/* Actions */}
                <button
                  onClick={() => exportOrderInvoice(order)}
                  className="px-8 py-3 border border-border rounded-sm text-[9px] font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all duration-500"
                >
                  Download Certificate
                </button>
              </div>
 
              {/* Simplified Progress Bar (Sub-row) */}
              <div className="bg-secondary/20 border-t border-border/40 px-8 py-3 flex items-center gap-6">
                 <p className="small-caps text-[8px] text-muted-foreground shrink-0">Pipeline</p>
                 <div className="flex-1 flex gap-1 h-[2px]">
                    {["pending", "confirmed", "shipping", "delivered"].map((step, sIdx) => (
                      <div 
                        key={step} 
                        className={`flex-1 rounded-full transition-all duration-1000 ${sIdx <= progress ? 'bg-accent' : 'bg-border/20'}`} 
                      />
                    ))}
                 </div>
                 <p className="text-[9px] font-serif italic text-muted-foreground/60 capitalize">
                    {order.status === 'pending' ? 'Registry Initiation' : 
                     order.status === 'confirmed' ? 'Verification Success' : 
                     order.status === 'shipping' ? 'Dispatch Processed' : 
                     order.status === 'cancelled' ? 'Registry Terminated' : 'Acquisitions Complete'}
                 </p>
              </div>
 
              {order.status === "cancelled" && (
                <div className="bg-destructive/5 px-8 py-3 border-t border-destructive/10 text-[10px] font-serif italic text-destructive text-center">
                  Registry Position Terminated - Asset Inventory Reverted
                </div>
              )}
            </motion.div>
          )
        })}
 
        {memberOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-sm border border-dashed border-border text-center grayscale opacity-60">
            <p className="font-serif text-2xl tracking-tighter text-foreground italic mb-2">Archive is Empty</p>
            <p className="text-sm font-serif text-muted-foreground italic">No portfolio entries detected in the house ledger.</p>
          </div>
        )}
      </div>
    </div>
  )
}
