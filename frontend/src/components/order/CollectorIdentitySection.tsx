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
    <section className="space-y-10">
      <h2 className="font-serif text-3xl text-foreground md:text-4xl">Collector Identity</h2>

      <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
        <div className="space-y-3">
          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Identity Name</label>
          <input
            value={receiverName}
            onChange={(e) => onReceiverNameChange(e.target.value)}
            className="w-full border-b border-border/50 bg-transparent py-3 font-serif text-xl text-foreground transition-all placeholder:opacity-20 hover:border-border focus:border-accent focus:outline-none md:text-2xl"
          />
        </div>
        <div className="space-y-3">
          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Contact Channel</label>
          <input
            value={receiverPhone}
            onChange={(e) => onReceiverPhoneChange(e.target.value)}
            className="w-full border-b border-border/50 bg-transparent py-3 font-serif text-xl text-foreground transition-all placeholder:opacity-20 hover:border-border focus:border-accent focus:outline-none md:text-2xl"
          />
        </div>
      </div>

      <div className="grid gap-6 pt-6 md:grid-cols-2">
        <button
          onClick={() => onShippingMethodChange("shipper")}
          className={`space-y-4 rounded-sm border px-8 py-6 text-left transition-all duration-500 ${
            shippingMethod === "shipper"
              ? "border-foreground bg-foreground text-background"
              : "border-border/50 bg-transparent hover:border-accent/40"
          }`}
        >
          <p
            className={`text-[9px] font-bold uppercase tracking-widest ${
              shippingMethod === "shipper" ? "text-accent/80" : "text-accent"
            }`}
          >
            Direct Transit
          </p>
          <div>
            <p className="font-serif text-xl md:text-2xl">Elite Courier</p>
            <p
              className={`mt-2 font-mono text-[10px] uppercase tracking-widest leading-relaxed ${
                shippingMethod === "shipper" ? "text-background/60" : "text-muted-foreground/50"
              }`}
            >
              Secure global logistics managed by HWJ specialists.
            </p>
          </div>
        </button>

        <button
          onClick={() => onShippingMethodChange("pickup")}
          className={`space-y-4 rounded-sm border px-8 py-6 text-left transition-all duration-500 ${
            shippingMethod === "pickup"
              ? "border-accent bg-accent/5 text-foreground"
              : "border-border/50 bg-transparent hover:border-accent/40"
          }`}
        >
          <p className="text-[9px] font-bold uppercase tracking-widest text-accent">Atelier Visit</p>
          <div>
            <p className="font-serif text-xl md:text-2xl">Private Collection</p>
            <p
              className={`mt-2 font-mono text-[10px] uppercase tracking-widest leading-relaxed ${
                shippingMethod === "pickup" ? "text-foreground/60" : "text-muted-foreground/50"
              }`}
            >
              Personally acquire your pieces at our flagship boardroom.
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
            className="space-y-4 pt-6"
          >
            <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Destination Ledger</label>
            <textarea
              value={shippingAddress}
              onChange={(e) => onShippingAddressChange(e.target.value)}
              className="h-20 w-full resize-none border-b border-border/50 bg-transparent py-3 font-serif text-xl text-foreground transition-all hover:border-border focus:border-accent focus:outline-none md:text-2xl"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 rounded-sm border border-border/40 bg-secondary/20 p-8 md:p-10"
          >
            <p className="mb-4 text-[9px] font-bold uppercase tracking-widest text-accent">HQ Boardroom Address</p>
            <p className="max-w-xl font-serif text-xl italic leading-relaxed text-foreground">{settings.pickupAddress}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3 pt-8">
        <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Archive Notes</label>
        <input
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Discreet instructions or custom orchestration..."
          className="w-full border-b border-border/50 bg-transparent py-3 font-serif text-lg italic text-foreground transition-all placeholder:text-muted-foreground/30 hover:border-border focus:border-accent focus:outline-none"
        />
      </div>
    </section>
  )
}
