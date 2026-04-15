type FinancialFrameworkSectionProps = {
  voucherInput: string
  onVoucherInputChange: (value: string) => void
  onApplyVoucher: () => void
  appliedVoucherAmount: number | null
  availablePoints: number
  pointsToUse: string
  onPointsToUseChange: (value: string) => void
  canUsePoints: boolean
  dollarsPerPoint: number
  formatUsd: (value: number) => string
}

export function FinancialFrameworkSection({
  voucherInput,
  onVoucherInputChange,
  onApplyVoucher,
  appliedVoucherAmount,
  availablePoints,
  pointsToUse,
  onPointsToUseChange,
  canUsePoints,
  dollarsPerPoint,
  formatUsd,
}: FinancialFrameworkSectionProps) {
  const safeDollarsPerPoint = Math.max(1, dollarsPerPoint || 1)
  const pointValueUsd = 1 / safeDollarsPerPoint

  return (
    <section className="space-y-4 border-t border-border pt-5 md:space-y-10 md:pt-14">
      <div className="space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Discount and points</p>
        <h2 className="text-xl font-semibold text-foreground md:font-serif md:text-4xl">Financial Framework</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:gap-10">
        <div className="space-y-3 rounded-sm border border-border/50 bg-background/60 p-3 md:space-y-6 md:bg-transparent md:p-8">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-accent md:font-bold md:tracking-widest">Voucher Authorization</p>
          <div className="flex gap-2">
            <input
              value={voucherInput}
              onChange={(e) => onVoucherInputChange(e.target.value.toUpperCase())}
              placeholder="ENTER CODE"
              className="h-10 min-w-0 flex-1 rounded-sm border border-border/60 bg-background px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground focus:border-accent focus:outline-none md:h-auto md:border-0 md:border-b md:bg-transparent md:px-0 md:pb-3 md:font-mono md:font-bold md:tracking-[0.3em] md:text-[11px]"
            />
            <button
              onClick={onApplyVoucher}
              className="h-10 shrink-0 rounded-sm border border-accent/30 px-3 text-[9px] font-semibold uppercase tracking-[0.08em] text-accent transition-colors hover:bg-accent/10 md:h-auto md:border-0 md:px-0 md:font-bold md:tracking-widest"
            >
              Validate
            </button>
          </div>
          {appliedVoucherAmount !== null && (
            <p className="text-[11px] text-accent md:pt-1 md:font-serif md:text-[10px] md:italic md:tracking-tight">
              System Notification: {formatUsd(appliedVoucherAmount)} reduction approved.
            </p>
          )}
        </div>

        <div className="space-y-3 rounded-sm border border-border/50 bg-background/60 p-3 md:space-y-6 md:bg-transparent md:p-8">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-accent md:font-bold md:tracking-widest">Loyalty Reserves</p>
          <div className="flex items-end justify-between gap-2">
            <p className="text-xs text-muted-foreground md:text-base md:font-serif md:italic">
              Archive Balance: <span className="ml-1 text-foreground">{availablePoints}</span>
            </p>
            <div className="rounded-sm border border-border/60 bg-background px-2">
              <input
                type="number"
                min="0"
                max={availablePoints}
                disabled={!canUsePoints}
                value={pointsToUse}
                onChange={(e) => onPointsToUseChange(e.target.value)}
                className="h-9 w-14 bg-transparent text-right text-lg text-foreground transition-all disabled:cursor-not-allowed disabled:opacity-40 focus:text-accent focus:outline-none md:h-auto md:w-20 md:border-0 md:bg-transparent md:font-serif md:text-2xl"
              />
            </div>
          </div>
          <div className="rounded-sm border border-border/40 bg-secondary/30 px-2.5 py-2 text-[9px] leading-relaxed text-muted-foreground/80 md:mt-3 md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-[8px] md:font-mono md:uppercase md:tracking-[0.2em] md:text-muted-foreground/60">
            <p className="text-[8px] font-medium uppercase tracking-[0.08em] text-muted-foreground/65 md:hidden">Policy Snapshot</p>
            <p className="mt-0.5 md:mt-0">Earn 1 point per {formatUsd(safeDollarsPerPoint)} spent.</p>
            <p>Redeem rate: 1 point = {formatUsd(pointValueUsd)}.</p>
            {!canUsePoints && <p className="mt-1 text-[9px] text-destructive/80">No loyalty points available yet.</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
