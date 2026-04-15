import { AnimatePresence, motion } from "framer-motion"
import type { ShippingMethod, StoreSettings } from "@/types/store"

type CollectorIdentitySectionProps = {
  receiverName: string
  onReceiverNameChange: (value: string) => void
  receiverPhone: string
  onReceiverPhoneChange: (value: string) => void
  shippingMethod: ShippingMethod
  onShippingMethodChange: (value: ShippingMethod) => void
  shippingAddress: string
  onShippingAddressChange: (value: string) => void
  note: string
  onNoteChange: (value: string) => void
  settings: StoreSettings
}

export function CollectorIdentitySection({
  receiverName,
  onReceiverNameChange,
  receiverPhone,
  onReceiverPhoneChange,
  shippingMethod,
  onShippingMethodChange,
  shippingAddress,
  onShippingAddressChange,
  note,
  onNoteChange,
  settings,
}: CollectorIdentitySectionProps) {
  return (
    <section className="space-y-4 md:space-y-10">
      <div className="space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Delivery profile</p>
        <h2 className="text-xl font-semibold text-foreground md:font-serif md:text-4xl">Collector Identity</h2>
      </div>

      <div className="grid gap-3 md:grid-cols-2 md:gap-x-12 md:gap-y-10">
        <div className="space-y-1.5 md:space-y-3">
          <label className="text-[10px] font-medium text-muted-foreground md:text-[9px] md:font-bold md:uppercase md:tracking-widest md:text-muted-foreground/60">Identity Name</label>
          <input
            value={receiverName}
            onChange={(e) => onReceiverNameChange(e.target.value)}
            className="h-11 w-full rounded-sm border border-border/60 bg-background/70 px-3 text-sm text-foreground transition-colors placeholder:opacity-40 focus:border-accent focus:outline-none md:h-auto md:border-0 md:border-b md:bg-transparent md:px-0 md:py-3 md:text-2xl md:font-serif"
          />
        </div>
        <div className="space-y-1.5 md:space-y-3">
          <label className="text-[10px] font-medium text-muted-foreground md:text-[9px] md:font-bold md:uppercase md:tracking-widest md:text-muted-foreground/60">Contact Channel</label>
          <input
            value={receiverPhone}
            onChange={(e) => onReceiverPhoneChange(e.target.value)}
            className="h-11 w-full rounded-sm border border-border/60 bg-background/70 px-3 text-sm text-foreground transition-colors placeholder:opacity-40 focus:border-accent focus:outline-none md:h-auto md:border-0 md:border-b md:bg-transparent md:px-0 md:py-3 md:text-2xl md:font-serif"
          />
        </div>
      </div>

      <div className="grid gap-2 pt-1 md:gap-6 md:pt-6 md:grid-cols-2">
        <button
          onClick={() => onShippingMethodChange("shipper")}
          className={`space-y-1.5 rounded-sm border px-3 py-3 text-left transition-all duration-300 md:space-y-4 md:px-8 md:py-6 md:duration-500 ${
            shippingMethod === "shipper"
              ? "border-foreground bg-foreground text-background"
              : "border-border/50 bg-transparent hover:border-accent/40"
          }`}
        >
          <p
            className={`text-[9px] font-semibold uppercase tracking-[0.08em] md:font-bold md:tracking-widest ${
              shippingMethod === "shipper" ? "text-accent/80" : "text-accent"
            }`}
          >
            Direct Transit
          </p>
          <div>
            <p className="text-sm font-semibold md:text-2xl md:font-serif">Elite Courier</p>
            <p
              className={`mt-1 text-[10px] leading-snug md:mt-2 md:font-mono md:uppercase md:tracking-widest md:leading-relaxed ${
                shippingMethod === "shipper" ? "text-background/60" : "text-muted-foreground/50"
              }`}
            >
              <span className="md:hidden">Secure shipping by HWJ.</span>
              <span className="hidden md:inline">Secure global logistics managed by HWJ specialists.</span>
            </p>
          </div>
        </button>

        <button
          onClick={() => onShippingMethodChange("pickup")}
          className={`space-y-1.5 rounded-sm border px-3 py-3 text-left transition-all duration-300 md:space-y-4 md:px-8 md:py-6 md:duration-500 ${
            shippingMethod === "pickup"
              ? "border-accent bg-accent/5 text-foreground"
              : "border-border/50 bg-transparent hover:border-accent/40"
          }`}
        >
          <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-accent md:font-bold md:tracking-widest">Atelier Visit</p>
          <div>
            <p className="text-sm font-semibold md:text-2xl md:font-serif">Private Collection</p>
            <p
              className={`mt-1 text-[10px] leading-snug md:mt-2 md:font-mono md:uppercase md:tracking-widest md:leading-relaxed ${
                shippingMethod === "pickup" ? "text-foreground/60" : "text-muted-foreground/50"
              }`}
            >
              <span className="md:hidden">Collect at HWJ showroom.</span>
              <span className="hidden md:inline">Personally acquire your pieces at our flagship boardroom.</span>
            </p>
          </div>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {shippingMethod === "shipper" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-1.5 pt-1 md:space-y-4 md:pt-6"
          >
            <label className="text-[10px] font-medium text-muted-foreground md:text-[9px] md:font-bold md:uppercase md:tracking-widest md:text-muted-foreground/60">Destination Ledger</label>
            <textarea
              value={shippingAddress}
              onChange={(e) => onShippingAddressChange(e.target.value)}
              className="h-20 w-full resize-none rounded-sm border border-border/60 bg-background/70 p-3 text-sm text-foreground transition-colors focus:border-accent focus:outline-none md:h-20 md:border-0 md:border-b md:bg-transparent md:p-0 md:py-3 md:text-2xl md:font-serif"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 rounded-sm border border-border/40 bg-secondary/20 p-3 md:mt-8 md:p-10"
          >
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.08em] text-accent md:mb-4 md:font-bold md:tracking-widest">HQ Boardroom Address</p>
            <p className="max-w-xl text-sm leading-relaxed text-foreground md:text-xl md:font-serif md:italic">{settings.pickupAddress}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-1.5 pt-2 md:space-y-3 md:pt-8">
        <label className="text-[10px] font-medium text-muted-foreground md:text-[9px] md:font-bold md:uppercase md:tracking-widest md:text-muted-foreground/60">Archive Notes</label>
        <input
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Discreet instructions or custom orchestration..."
          className="h-11 w-full rounded-sm border border-border/60 bg-background/70 px-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground/45 focus:border-accent focus:outline-none md:h-auto md:border-0 md:border-b md:bg-transparent md:px-0 md:py-3 md:text-lg md:font-serif md:italic"
        />
      </div>
    </section>
  )
}
