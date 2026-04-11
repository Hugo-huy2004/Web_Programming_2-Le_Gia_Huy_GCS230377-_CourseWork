import { AnimatePresence, motion } from "framer-motion"
import { Award, CreditCard, MapPin, Phone, User, X } from "lucide-react"
import type { CustomerAccount, Order } from "@/types/store"

type EditProfileForm = {
  fullName: string
  phone: string
  address: string
  birthday: string
}

type CustomerDossierDrawerProps = {
  isOpen: boolean
  selectedCustomer: CustomerAccount | null
  editForm: EditProfileForm
  setEditForm: React.Dispatch<React.SetStateAction<EditProfileForm>>
  saveStatus: string
  customerOrders: Order[]
  formatUsd: (value: number) => string
  onClose: () => void
  onSaveProfile: () => Promise<void>
}

export function CustomerDossierDrawer({
  isOpen,
  selectedCustomer,
  editForm,
  setEditForm,
  saveStatus,
  customerOrders,
  formatUsd,
  onClose,
  onSaveProfile,
}: CustomerDossierDrawerProps) {
  return (
    <AnimatePresence mode="wait">
      {isOpen && selectedCustomer && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="relative w-full max-w-2xl overflow-y-auto border-l border-border/40 bg-white shadow-2xl"
          >
            <div className="space-y-12 p-10 md:p-16">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <p className="small-caps text-[10px] font-medium tracking-[0.2em] text-accent">Collector Dossier / Sec. ALPHA</p>
                  <h3 className="font-serif text-4xl italic tracking-tight text-foreground">{selectedCustomer.email}</h3>
                  <div className="flex gap-4 pt-2">
                    <div className="flex-1 space-y-1 rounded-sm border border-border/20 bg-secondary/30 p-6">
                      <p className="small-caps text-[9px] font-bold tracking-[0.2em] text-muted-foreground/40">Total Portfolio Value</p>
                      <p className="font-serif text-2xl italic tracking-tighter text-foreground">{formatUsd(selectedCustomer.totalSpent)}</p>
                    </div>
                    <div className="flex-1 space-y-1 rounded-sm border border-border bg-foreground p-6 shadow-editorial">
                      <p className="small-caps text-[9px] font-bold tracking-[0.2em] text-accent/60">Institutional Loyalty</p>
                      <p className="font-serif text-2xl italic tracking-tighter text-accent">{selectedCustomer.loyaltyPoints} PTS</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-sm border border-border/60 p-3 transition-all duration-500 hover:border-accent hover:text-accent"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-10 border border-border bg-white p-10 shadow-editorial">
                <div className="flex items-center gap-4">
                  <Award className="h-5 w-5 text-accent opacity-60" />
                  <p className="small-caps text-[11px] font-bold tracking-[0.2em] text-accent">Identity Registry Refinement</p>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="small-caps text-[9px] tracking-[0.2em] text-muted-foreground/60">Legal Identity Name</label>
                    <div className="group relative">
                      <User className="absolute bottom-2 left-0 h-4 w-4 text-muted-foreground/20 transition-colors group-focus-within:text-accent" />
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, fullName: e.target.value }))}
                        className="w-full border-b border-border bg-transparent py-2 pl-8 font-serif text-xl italic outline-none transition-all duration-700 focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="small-caps text-[9px] tracking-[0.2em] text-muted-foreground/60">Registry Contact</label>
                    <div className="group relative">
                      <Phone className="absolute bottom-2 left-0 h-4 w-4 text-muted-foreground/20 transition-colors group-focus-within:text-accent" />
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className="w-full border-b border-border bg-transparent py-2 pl-8 font-serif text-xl italic outline-none transition-all duration-700 focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="small-caps text-[9px] tracking-[0.2em] text-muted-foreground/60">Primary Residence</label>
                    <div className="group relative">
                      <MapPin className="absolute left-0 top-1 h-4 w-4 text-muted-foreground/20 transition-colors group-focus-within:text-accent" />
                      <textarea
                        rows={2}
                        value={editForm.address}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, address: e.target.value }))}
                        className="w-full resize-none border-b border-border bg-transparent py-1 pl-8 font-serif text-lg italic outline-none transition-all duration-700 focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6">
                    <AnimatePresence>
                      {saveStatus && (
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="font-serif text-[14px] italic text-accent"
                        >
                          {saveStatus}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <button
                      onClick={() => void onSaveProfile()}
                      className="ml-auto rounded-sm bg-foreground px-14 py-5 text-[11px] font-bold uppercase tracking-[0.3em] text-background outline-none transition-all duration-700 hover:bg-accent hover:shadow-xl"
                    >
                      Synchronize Entry
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <CreditCard className="h-5 w-5 text-accent opacity-60" />
                  <p className="small-caps text-[11px] font-bold tracking-[0.2em] text-accent">Acquisition History Manifest</p>
                </div>

                {customerOrders.length > 0 ? (
                  <div className="space-y-4">
                    {customerOrders.map((order) => (
                      <div
                        key={order.id}
                        className="group flex items-center justify-between border border-border bg-secondary/20 p-8 transition-all duration-700 hover:bg-white hover:shadow-editorial"
                      >
                        <div className="space-y-1">
                          <p className="small-caps text-[9px] font-bold tracking-[0.2em] text-accent/60">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="font-serif text-xl uppercase tracking-tight text-foreground transition-colors group-hover:text-accent">
                            {order.orderCode}
                          </p>
                        </div>
                        <div className="space-y-2 text-right">
                          <p className="font-serif text-xl italic text-foreground">{formatUsd(order.total)}</p>
                          <span className="small-caps bg-foreground px-3 py-1 text-[9px] font-bold text-background">{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-sm border-2 border-dashed border-border/40 py-20 text-center">
                    <p className="font-serif text-lg italic text-muted-foreground opacity-30">
                      Archive reflects zero historical acquisitions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
