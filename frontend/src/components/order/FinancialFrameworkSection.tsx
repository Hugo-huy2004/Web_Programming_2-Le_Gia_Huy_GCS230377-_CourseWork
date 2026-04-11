type FinancialFrameworkSectionProps = {
  voucherInput: string
  onVoucherInputChange: (value: string) => void
  onApplyVoucher: () => void
  appliedVoucherAmount: number | null
  availablePoints: number
  pointsToUse: string
  onPointsToUseChange: (value: string) => void
  canUsePoints: boolean
  minimumPointsToRedeem: number
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
  minimumPointsToRedeem,
  formatUsd,
}: FinancialFrameworkSectionProps) {
  return (
    <section className="space-y-10 border-t border-border pt-14">
      <h2 className="font-serif text-3xl text-foreground md:text-4xl">Financial Framework</h2>

      <div className="grid gap-10 sm:grid-cols-2">
        <div className="space-y-6 rounded-sm border border-border/50 bg-transparent p-8">
          <p className="text-[9px] font-bold uppercase tracking-widest text-accent">Voucher Authorization</p>
          <div className="flex gap-4 border-b border-border/40 pb-3">
            <input
              value={voucherInput}
              onChange={(e) => onVoucherInputChange(e.target.value.toUpperCase())}
              placeholder="ENTER CODE"
              className="flex-1 bg-transparent font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-foreground focus:outline-none md:text-[11px]"
            />
            <button
              onClick={onApplyVoucher}
              className="text-[9px] font-bold uppercase tracking-widest text-accent/80 transition-colors hover:text-accent"
            >
              Validate
            </button>
          </div>
          {appliedVoucherAmount !== null && (
            <p className="pt-1 font-serif text-[10px] italic tracking-tight text-accent">
              System Notification: {formatUsd(appliedVoucherAmount)} reduction approved.
            </p>
          )}
        </div>

        <div className="space-y-6 rounded-sm border border-border/50 bg-transparent p-8">
          <p className="text-[9px] font-bold uppercase tracking-widest text-accent">Loyalty Reserves</p>
          <div className="flex items-end justify-between gap-3 border-b border-border/40 pb-3">
            <p className="font-serif text-base italic text-muted-foreground">
              Archive Balance: <span className="ml-1 text-foreground">{availablePoints}</span>
            </p>
            <input
              type="number"
              min="0"
              max={availablePoints}
              disabled={!canUsePoints}
              value={pointsToUse}
              onChange={(e) => onPointsToUseChange(e.target.value)}
              className="w-20 bg-transparent text-right font-serif text-2xl text-foreground transition-all disabled:cursor-not-allowed disabled:opacity-40 focus:text-accent focus:outline-none"
            />
          </div>
          <div className="mt-3 font-mono text-[8px] uppercase tracking-[0.2em] leading-relaxed text-muted-foreground/60">
            <p>Redemption Ratio: $0.50 USD / point.</p>
            {!canUsePoints && (
              <p className="mt-1 font-serif text-[10px] normal-case italic tracking-normal text-destructive/80">
                * Vault requires a minimum of {minimumPointsToRedeem || 1} points to initiate redemption.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
