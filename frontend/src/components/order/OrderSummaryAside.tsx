import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import type { CalculatedOrderItem } from "@/lib/orderCalculations"
import type { ShippingMethod } from "@/types/store"

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID ?? "sb"

type OrderSummaryAsideProps = {
  items: CalculatedOrderItem[]
  subtotal: number
  shippingMethod: ShippingMethod
  shippingFee: number
  tax: number
  voucherDiscount: number
  pointsDiscount: number
  total: number
  isSubmitting: boolean
  formatUsd: (value: number) => string
  createPayPalOrder: (data: unknown, actions: any) => Promise<string>
  handlePayPalApprove: (data: unknown, actions: any) => Promise<void>
}

export function OrderSummaryAside({
  items,
  subtotal,
  shippingMethod,
  shippingFee,
  tax,
  voucherDiscount,
  pointsDiscount,
  total,
  isSubmitting,
  formatUsd,
  createPayPalOrder,
  handlePayPalApprove,
}: OrderSummaryAsideProps) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-24 lg:space-y-6">
      <div className="space-y-4 rounded-sm border border-border bg-background p-4 shadow-editorial md:space-y-10 md:p-8">
        <p className="border-b border-border pb-3 text-center text-[10px] font-semibold uppercase tracking-[0.12em] md:small-caps md:pb-6">Manifest Summary</p>

        <div className="no-scrollbar max-h-[260px] space-y-3 overflow-y-auto pr-1 md:max-h-[350px] md:space-y-8 md:pr-4">
          {items.map((item) => (
            <div key={item.id} className="group flex gap-3 md:gap-6">
              <div className="h-14 w-14 shrink-0 rounded-sm border border-border bg-secondary p-1.5 md:h-20 md:w-20 md:p-2">
                <img src={item.imageUrl} className="h-full w-full object-contain mix-blend-multiply" />
              </div>
              <div className="min-w-0 flex-1 space-y-1 md:space-y-2">
                <p className="line-clamp-2 text-[13px] leading-tight text-foreground transition-colors group-hover:text-accent md:font-serif md:text-[15px]">
                  {item.name}
                </p>
                <p className="text-[9px] uppercase tracking-[0.08em] opacity-60 md:small-caps">Ref. {item.productCode} | x{item.quantity}</p>
              </div>
              <p className="shrink-0 text-[13px] font-semibold text-foreground md:font-serif md:text-[15px]">
                {formatUsd(item.unitPrice * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-2 border-t border-border pt-4 md:space-y-4 md:pt-8">
          <div className="flex justify-between text-[10px] uppercase tracking-[0.08em] md:small-caps">
            <span>Archive Subtotal</span>
            <span className="text-foreground">{formatUsd(subtotal)}</span>
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-[0.08em] md:small-caps">
            <span>Logistics Orches.</span>
            <span className="text-foreground">{shippingMethod === "pickup" ? "Exempt" : formatUsd(shippingFee)}</span>
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-[0.08em] md:small-caps">
            <span>Real-time Tax (10%)</span>
            <span className="text-foreground">{formatUsd(tax)}</span>
          </div>
          <div className="flex justify-between text-[10px] uppercase tracking-[0.08em] text-accent md:small-caps">
            <span>House Benefit</span>
            <span>-{formatUsd(voucherDiscount + pointsDiscount)}</span>
          </div>

          <div className="flex items-end justify-between border-t border-border pt-4 md:pt-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground md:small-caps md:text-[11px]">Final Valuation</p>
            <p className="text-2xl font-semibold tracking-tight text-foreground md:font-serif md:text-4xl md:tracking-tighter">{formatUsd(total)}</p>
          </div>
        </div>

        <div className="pt-3 md:pt-8">
          {total > 0 ? (
            <PayPalScriptProvider
              options={{
                clientId: PAYPAL_CLIENT_ID,
                currency: "USD",
                disableFunding: ["card", "credit", "paylater", "venmo"],
              }}
            >
              <PayPalButtons
                fundingSource="paypal"
                style={{ layout: "vertical", color: "black", shape: "rect", label: "paypal" }}
                disabled={isSubmitting}
                createOrder={createPayPalOrder}
                onApprove={handlePayPalApprove}
              />
            </PayPalScriptProvider>
          ) : (
            <div className="space-y-3">
              <button
                disabled
                className="w-full cursor-not-allowed rounded-sm bg-muted py-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground md:py-6 md:text-[11px] md:font-bold md:tracking-[0.24em]"
              >
                PayPal unavailable for $0.00 orders
              </button>
              <p className="text-center text-[10px] text-muted-foreground/70 md:font-serif md:italic">
                Please, contact the House Ledger for further assistance.
              </p>
            </div>
          )}
        </div>

        <p className="pt-2 text-center text-[10px] text-muted-foreground/45 md:pt-6 md:font-serif md:italic md:tracking-tight md:text-muted-foreground/40">
          The House Ledger Archive • Vol. 14.2
        </p>
      </div>
    </aside>
  )
}
