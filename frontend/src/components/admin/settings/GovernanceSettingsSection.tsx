import { Award, Globe, Save } from "lucide-react"

type GovernanceSettingsSectionProps = {
  shipperFee: string
  onShipperFeeChange: (value: string) => void
  dollarsPerPoint: string
  onDollarsPerPointChange: (value: string) => void
  onSaveSettings: () => void
}

export function GovernanceSettingsSection({
  shipperFee,
  onShipperFeeChange,
  dollarsPerPoint,
  onDollarsPerPointChange,
  onSaveSettings,
}: GovernanceSettingsSectionProps) {
  const safeDollarsPerPoint = Math.max(1, Number(dollarsPerPoint) || 1)
  const pointValueUsd = (1 / safeDollarsPerPoint).toFixed(4)

  return (
    <section className="space-y-4 md:space-y-12">
      <div className="flex flex-col items-start justify-between gap-2 border-b border-border/40 pb-3 md:flex-row md:items-end md:gap-6 md:pb-8">
        <div className="space-y-1.5 md:space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-accent md:small-caps md:font-medium md:tracking-[0.2em]">
            Strategic Portfolio Orchestration
          </p>
          <h2 className="text-lg font-semibold tracking-tight text-foreground md:font-serif md:text-4xl md:italic">Governance Manifest</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
        <div className="space-y-1.5 md:space-y-4">
          <label className="text-[10px] font-medium text-muted-foreground md:small-caps md:text-[9px] md:font-bold md:tracking-[0.2em]">
            Logistics Curation Fee ($)
          </label>
          <div className="group relative">
            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/30 transition-colors group-focus-within:text-accent md:bottom-2 md:top-auto md:left-0 md:translate-y-0 md:text-muted-foreground/20" />
            <input
              type="number"
              value={shipperFee}
              onChange={(e) => onShipperFeeChange(e.target.value)}
              className="h-10 w-full rounded-sm border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-accent md:h-auto md:border-0 md:border-b md:bg-transparent md:py-2 md:pl-8 md:font-serif md:text-xl md:italic md:duration-700"
            />
          </div>
        </div>

        <div className="space-y-1.5 md:space-y-4">
          <label className="text-[10px] font-medium text-muted-foreground md:small-caps md:text-[9px] md:font-bold md:tracking-[0.2em]">
            USD Required for 1 Point
          </label>
          <div className="group relative">
            <Award className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/30 transition-colors group-focus-within:text-accent md:bottom-2 md:top-auto md:left-0 md:translate-y-0 md:text-muted-foreground/20" />
            <input
              type="number"
              value={dollarsPerPoint}
              onChange={(e) => onDollarsPerPointChange(e.target.value)}
              className="h-10 w-full rounded-sm border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-accent md:h-auto md:border-0 md:border-b md:bg-transparent md:py-2 md:pl-8 md:font-serif md:text-xl md:italic md:duration-700"
            />
          </div>
          <div className="rounded-sm border border-border/40 bg-secondary/30 px-2.5 py-2 md:border-0 md:bg-transparent md:px-0 md:py-0">
            <p className="text-[8px] font-medium uppercase tracking-[0.08em] text-muted-foreground/65 md:text-[9px]">
              Policy Snapshot
            </p>
            <p className="mt-0.5 text-[9px] leading-relaxed text-muted-foreground/80 md:mt-1 md:text-[10px] md:text-muted-foreground/70">
              Spend {"$"}{safeDollarsPerPoint} to earn 1 point. Value per point: ${pointValueUsd}.
            </p>
          </div>
        </div>

        <div className="flex items-end">
          <button
            onClick={onSaveSettings}
            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-sm bg-foreground px-3 text-[9px] font-semibold uppercase tracking-[0.08em] text-background shadow-editorial transition-all duration-300 hover:bg-accent md:h-auto md:gap-3 md:px-0 md:py-5 md:text-[11px] md:font-bold md:tracking-[0.3em] md:duration-700"
          >
            <Save className="h-3.5 w-3.5 md:h-4 md:w-4" />
            Commit Governance
          </button>
        </div>
      </div>
    </section>
  )
}
