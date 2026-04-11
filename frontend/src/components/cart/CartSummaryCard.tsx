import { Link } from "react-router-dom"

type CartSummaryCardProps = {
  activeCustomerEmail: string | null
  cartTotalValue: number
  formatUsd: (value: number) => string
  onCheckout: () => void
}

export function CartSummaryCard({
  activeCustomerEmail,
  cartTotalValue,
  formatUsd,
  onCheckout,
}: CartSummaryCardProps) {
  return (
    <aside className="sticky top-20 space-y-8">
      <div className="group relative space-y-8 overflow-hidden rounded-sm border border-border/10 bg-foreground p-8 text-background shadow-2xl md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-40 mix-blend-overlay" />

        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Acquisition Total</p>
            <p className="font-serif text-4xl italic tracking-tighter md:text-5xl">{formatUsd(cartTotalValue * 1.1)}</p>
            <p className="font-mono text-[9px] uppercase tracking-widest leading-none text-background/60">
              Incl. Estimated 10% VAT
            </p>
          </div>

          <div className="h-px w-full bg-background/10" />

          <div className="space-y-6 pt-2">
            <p className="font-serif text-[11px] italic leading-relaxed text-background/70">
              By proceeding, your curation will be transitioned to the final acquisition contract for verification.
            </p>

            <button
              onClick={onCheckout}
              className="w-full rounded-sm bg-accent py-5 text-[11px] font-bold uppercase tracking-[0.3em] text-white shadow-lg transition-all duration-500 hover:scale-[1.02] hover:bg-white hover:text-accent hover:shadow-accent/40"
            >
              {activeCustomerEmail ? "Acquire Now" : "Identify As Collector"}
            </button>
          </div>
        </div>
      </div>

      {!activeCustomerEmail && (
        <div className="space-y-4 rounded-sm border border-dashed border-border bg-secondary/10 p-8 text-center">
          <p className="font-serif text-xs italic leading-relaxed text-muted-foreground">
            Identify yourself to access private member benefits and point redemption.
          </p>
          <Link
            to="/user"
            className="inline-block border-b border-accent/30 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent transition-all hover:border-accent"
          >
            Identity Verification
          </Link>
        </div>
      )}
    </aside>
  )
}
