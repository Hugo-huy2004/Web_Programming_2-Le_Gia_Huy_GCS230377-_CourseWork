import { Link } from "react-router-dom"

type CartSummaryCardProps = {
  activeCustomerEmail: string | null
  cartTotalValue: number
  itemCount: number
  formatUsd: (value: number) => string
  onCheckout: () => void
}

export function CartSummaryCard({
  activeCustomerEmail,
  cartTotalValue,
  itemCount,
  formatUsd,
  onCheckout,
}: CartSummaryCardProps) {
  return (
    <aside className="space-y-4 md:sticky md:top-20 md:space-y-8">
      <div className="group relative hidden space-y-4 overflow-hidden rounded-sm border border-border/10 bg-foreground p-4 text-background shadow-xl md:block md:space-y-8 md:p-10 md:shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-40 mix-blend-overlay" />

        <div className="relative z-10 space-y-5 md:space-y-10">
          <div className="space-y-2 md:space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent md:font-bold md:tracking-widest">Acquisition Total</p>
            <p className="text-3xl font-semibold tracking-tight md:font-serif md:text-5xl md:italic md:tracking-tighter">{formatUsd(cartTotalValue * 1.1)}</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] leading-none text-background/70 md:tracking-widest">
              Incl. Estimated 10% VAT
            </p>
          </div>

          <div className="h-px w-full bg-background/10" />

          <div className="space-y-3 pt-1 md:space-y-6 md:pt-2">
            <p className="text-[12px] leading-relaxed text-background/75 md:font-serif md:text-[11px] md:italic">
              By proceeding, your curation will be transitioned to the final acquisition contract for verification.
            </p>

            <button
              onClick={onCheckout}
              className="w-full rounded-sm bg-accent py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-white hover:text-accent md:py-5 md:font-bold md:tracking-[0.3em] md:shadow-lg md:hover:scale-[1.02] md:hover:shadow-accent/40"
            >
              {activeCustomerEmail ? "Acquire Now" : "Identify As Collector"}
            </button>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-[calc(96px+env(safe-area-inset-bottom))] z-40 px-2.5 md:hidden">
        <div className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-2xl border border-white/55 bg-white/70 p-2 shadow-[0_10px_26px_rgba(0,0,0,0.14)] backdrop-blur-xl">
          <div className="min-w-0 flex-1">
            <p className="text-[8px] uppercase tracking-[0.1em] text-muted-foreground/80">{itemCount} items · VAT incl.</p>
            <p className="truncate text-sm font-semibold text-foreground">{formatUsd(cartTotalValue * 1.1)}</p>
          </div>
          <button
            onClick={onCheckout}
            className="h-10 rounded-xl bg-accent px-4 text-[9px] font-semibold uppercase tracking-[0.08em] text-white shadow-[0_8px_18px_rgba(182,132,0,0.35)]"
          >
            {activeCustomerEmail ? "Acquire Now" : "Sign In"}
          </button>
        </div>
      </div>

      {!activeCustomerEmail && (
        <div className="space-y-3 rounded-sm border border-dashed border-border bg-secondary/10 p-4 text-center md:space-y-4 md:p-8">
          <p className="text-xs leading-relaxed text-muted-foreground md:font-serif md:italic">
            Identify yourself to access private member benefits and point redemption.
          </p>
          <Link
            to="/user"
            className="inline-block border-b border-accent/30 pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-accent transition-all hover:border-accent md:font-bold md:tracking-[0.2em]"
          >
            Identity Verification
          </Link>
        </div>
      )}
    </aside>
  )
}
