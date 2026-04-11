import { AnimatePresence, motion } from "framer-motion"
import { Award, Globe, Key, MapPin, Save } from "lucide-react"

type GovernanceSettingsSectionProps = {
  message: string
  shipperFee: string
  onShipperFeeChange: (value: string) => void
  dollarsPerPoint: string
  onDollarsPerPointChange: (value: string) => void
  minimumPointsToRedeem: string
  onMinimumPointsToRedeemChange: (value: string) => void
  pickupAddress: string
  onPickupAddressChange: (value: string) => void
  onSaveSettings: () => void
}

export function GovernanceSettingsSection({
  message,
  shipperFee,
  onShipperFeeChange,
  dollarsPerPoint,
  onDollarsPerPointChange,
  minimumPointsToRedeem,
  onMinimumPointsToRedeemChange,
  pickupAddress,
  onPickupAddressChange,
  onSaveSettings,
}: GovernanceSettingsSectionProps) {
  return (
    <section className="space-y-12">
      <div className="flex flex-col items-start justify-between gap-6 border-b border-border/40 pb-8 md:flex-row md:items-end">
        <div className="space-y-2">
          <p className="small-caps text-[10px] font-medium tracking-[0.2em] text-accent">
            Strategic Portfolio Orchestration
          </p>
          <h2 className="font-serif text-4xl italic tracking-tight text-foreground">Governance Manifest</h2>
        </div>
        <AnimatePresence>
          {message && (
            <motion.p
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="small-caps text-[13px] font-serif italic text-accent"
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <label className="small-caps text-[9px] font-bold tracking-[0.2em] text-muted-foreground">
            Logistics Curation Fee ($)
          </label>
          <div className="group relative">
            <Globe className="absolute bottom-2 left-0 h-4 w-4 text-muted-foreground/20 transition-colors group-focus-within:text-accent" />
            <input
              type="number"
              value={shipperFee}
              onChange={(e) => onShipperFeeChange(e.target.value)}
              className="w-full border-b border-border bg-transparent py-2 pl-8 font-serif text-xl italic outline-none transition-all duration-700 focus:border-accent"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="small-caps text-[9px] font-bold tracking-[0.2em] text-muted-foreground">
            Valuation per Loyalty Point
          </label>
          <div className="group relative">
            <Award className="absolute bottom-2 left-0 h-4 w-4 text-muted-foreground/20 transition-colors group-focus-within:text-accent" />
            <input
              type="number"
              value={dollarsPerPoint}
              onChange={(e) => onDollarsPerPointChange(e.target.value)}
              className="w-full border-b border-border bg-transparent py-2 pl-8 font-serif text-xl italic outline-none transition-all duration-700 focus:border-accent"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="small-caps text-[9px] font-bold tracking-[0.2em] text-muted-foreground">
            Min. Redemption Registry
          </label>
          <div className="group relative">
            <Key className="absolute bottom-2 left-0 h-4 w-4 text-muted-foreground/20 transition-colors group-focus-within:text-accent" />
            <input
              type="number"
              value={minimumPointsToRedeem}
              onChange={(e) => onMinimumPointsToRedeemChange(e.target.value)}
              className="w-full border-b border-border bg-transparent py-2 pl-8 font-serif text-xl italic outline-none transition-all duration-700 focus:border-accent"
            />
          </div>
        </div>

        <div className="flex items-end">
          <button
            onClick={onSaveSettings}
            className="flex w-full items-center justify-center gap-3 rounded-sm bg-foreground py-5 text-[11px] font-bold uppercase tracking-[0.3em] text-background shadow-editorial transition-all duration-700 hover:bg-accent"
          >
            <Save className="h-4 w-4" />
            Commit Governance
          </button>
        </div>

        <div className="space-y-4 md:col-span-2 lg:col-span-4">
          <label className="small-caps text-[9px] font-bold tracking-[0.2em] text-muted-foreground">
            Heritage Collection Point (Address Registry)
          </label>
          <div className="group relative">
            <MapPin className="absolute bottom-2 left-0 h-4 w-4 text-muted-foreground/20 transition-colors group-focus-within:text-accent" />
            <input
              type="text"
              value={pickupAddress}
              onChange={(e) => onPickupAddressChange(e.target.value)}
              className="w-full border-b border-border bg-transparent py-2 pl-8 font-serif text-lg italic text-foreground outline-none transition-all duration-700 focus:border-accent"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
