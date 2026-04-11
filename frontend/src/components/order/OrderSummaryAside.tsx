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
    <aside className="space-y-6 lg:sticky lg:top-24">
      <div className="space-y-8 rounded-sm border border-border bg-background p-5 shadow-editorial md:space-y-10 md:p-8">
        <p className="small-caps border-b border-border pb-6 text-center">Manifest Summary</p>

        <div className="no-scrollbar max-h-[350px] space-y-6 overflow-y-auto pr-2 md:space-y-8 md:pr-4">
          {items.map((item) => (
            <div key={item.id} className="group flex gap-4 md:gap-6">
              <div className="h-16 w-16 shrink-0 rounded-sm border border-border bg-secondary p-2 md:h-20 md:w-20">
                <img src={item.imageUrl} className="h-full w-full object-contain mix-blend-multiply" />
              </div>
              <div className="flex-1 space-y-2">
                <p className="font-serif text-[14px] leading-tight text-foreground transition-colors group-hover:text-accent md:text-[15px]">
                  {item.name}
                </p>
                <p className="small-caps opacity-60">Ref. {item.productCode} | x{item.quantity}</p>
              </div>
              <p className="font-serif text-[14px] text-foreground md:text-[15px]">
                {formatUsd(item.unitPrice * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-4 border-t border-border pt-8">
          <div className="small-caps flex justify-between text-[10px]">
            <span>Archive Subtotal</span>
            <span className="text-foreground">{formatUsd(subtotal)}</span>
          </div>
          <div className="small-caps flex justify-between text-[10px]">
            <span>Logistics Orches.</span>
            <span className="text-foreground">{shippingMethod === "pickup" ? "Exempt" : formatUsd(shippingFee)}</span>
          </div>
          <div className="small-caps flex justify-between text-[10px]">
            <span>Real-time Tax (10%)</span>
            <span className="text-foreground">{formatUsd(tax)}</span>
          </div>
          <div className="small-caps flex justify-between text-[10px] text-accent">
            <span>House Benefit</span>
            <span>-{formatUsd(voucherDiscount + pointsDiscount)}</span>
          </div>

          <div className="flex items-end justify-between border-t border-border pt-8">
            <p className="small-caps text-[11px] text-foreground">Final Valuation</p>
            <p className="font-serif text-3xl tracking-tighter text-foreground md:text-4xl">{formatUsd(total)}</p>
          </div>
        </div>

        <div className="pt-8">
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
                className="w-full cursor-not-allowed rounded-sm bg-muted py-6 text-[11px] font-bold uppercase tracking-[0.24em] text-muted-foreground"
              >
                PayPal unavailable for $0.00 orders
              </button>
              <p className="text-center font-serif text-[10px] italic text-muted-foreground/70">
                Please, contact the House Ledger for further assistance.
              </p>
            </div>
          )}
        </div>

        <p className="pt-6 text-center font-serif text-[10px] italic tracking-tight text-muted-foreground/40">
          The House Ledger Archive • Vol. 14.2
        </p>
      </div>
    </aside>
  )
}
