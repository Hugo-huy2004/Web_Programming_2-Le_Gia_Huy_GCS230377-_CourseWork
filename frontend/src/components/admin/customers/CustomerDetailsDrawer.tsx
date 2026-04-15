import { AnimatePresence, motion } from "framer-motion"
import { Award, CreditCard, MapPin, Phone, User, X } from "lucide-react"
import type { CustomerAccount, Order } from "@/types/store"

type EditProfileForm = {
  fullName: string
  phone: string
  address: string
  birthday: string
}

type CustomerDetailsDrawerProps = {
  isOpen: boolean
  selectedCustomer: CustomerAccount | null
  editForm: EditProfileForm
  setEditForm: React.Dispatch<React.SetStateAction<EditProfileForm>>
  customerOrders: Order[]
  formatUsd: (value: number) => string
  onClose: () => void
  onSaveProfile: () => Promise<void>
}

export function CustomerDetailsDrawer({
  isOpen,
  selectedCustomer,
  editForm,
  setEditForm,
  customerOrders,
  formatUsd,
  onClose,
  onSaveProfile,
}: CustomerDetailsDrawerProps) {
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
            className="liquid-glass-strong relative w-full max-w-2xl overflow-y-auto border-l border-border/40 shadow-2xl"
          >
            <div className="space-y-5 p-3 md:space-y-12 md:p-16">
              <div className="flex items-start justify-between">
                <div className="min-w-0 space-y-2 md:space-y-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-accent md:small-caps md:font-medium md:tracking-[0.2em]">Customer Details / Sec. ALPHA</p>
                  <h3 className="break-all text-base font-semibold tracking-tight text-foreground md:font-serif md:text-4xl md:italic">{selectedCustomer.email}</h3>
                  <div className="grid grid-cols-2 gap-2 pt-1 md:flex md:gap-4 md:pt-2">
                    <div className="liquid-glass flex-1 space-y-1 rounded-sm border border-border/20 p-3 md:p-6">
                      <p className="text-[9px] font-medium text-muted-foreground/60 md:small-caps md:font-bold md:tracking-[0.2em] md:text-muted-foreground/40">Total Portfolio Value</p>
                      <p className="text-sm font-semibold tracking-tight text-foreground md:font-serif md:text-2xl md:italic md:tracking-tighter">{formatUsd(selectedCustomer.totalSpent)}</p>
                    </div>
                    <div className="liquid-glass flex-1 space-y-1 rounded-sm border border-border p-3 shadow-editorial md:p-6">
                      <p className="text-[9px] font-medium text-accent/70 md:small-caps md:font-bold md:tracking-[0.2em] md:text-accent/60">Loyalty Points</p>
                      <p className="text-sm font-semibold tracking-tight text-accent md:font-serif md:text-2xl md:italic md:tracking-tighter">{selectedCustomer.loyaltyPoints} PTS</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-sm border border-border/60 p-2 transition-all duration-300 hover:border-accent hover:text-accent md:p-3 md:duration-500"
                >
                  <X className="h-4 w-4 md:h-5 md:w-5" />
                </button>
              </div>

              <div className="liquid-glass space-y-4 border border-border p-3 shadow-editorial md:space-y-10 md:p-10">
                <div className="flex items-center gap-3 md:gap-4">
                  <Award className="h-4 w-4 text-accent opacity-60 md:h-5 md:w-5" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-accent md:small-caps md:text-[11px] md:font-bold md:tracking-[0.2em]">Edit Contact Details</p>
                </div>

                <div className="space-y-3 md:space-y-8">
                  <div className="space-y-1.5 md:space-y-3">
                    <label className="text-[10px] font-medium text-muted-foreground/70 md:small-caps md:text-[9px] md:tracking-[0.2em] md:text-muted-foreground/60">Full Name</label>
                    <div className="group relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/30 transition-colors group-focus-within:text-accent md:bottom-2 md:top-auto md:left-0 md:translate-y-0 md:text-muted-foreground/20" />
                      <input
                        type="text"
                        value={editForm.fullName}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, fullName: e.target.value }))}
                        className="h-10 w-full rounded-sm border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-accent md:h-auto md:border-0 md:border-b md:bg-transparent md:py-2 md:pl-8 md:font-serif md:text-xl md:italic md:duration-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:space-y-3">
                    <label className="text-[10px] font-medium text-muted-foreground/70 md:small-caps md:text-[9px] md:tracking-[0.2em] md:text-muted-foreground/60">Phone</label>
                    <div className="group relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/30 transition-colors group-focus-within:text-accent md:bottom-2 md:top-auto md:left-0 md:translate-y-0 md:text-muted-foreground/20" />
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className="h-10 w-full rounded-sm border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-accent md:h-auto md:border-0 md:border-b md:bg-transparent md:py-2 md:pl-8 md:font-serif md:text-xl md:italic md:duration-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 md:space-y-3">
                    <label className="text-[10px] font-medium text-muted-foreground/70 md:small-caps md:text-[9px] md:tracking-[0.2em] md:text-muted-foreground/60">Address</label>
                    <div className="group relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/30 transition-colors group-focus-within:text-accent md:left-0 md:top-1 md:text-muted-foreground/20" />
                      <textarea
                        rows={2}
                        value={editForm.address}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, address: e.target.value }))}
                        className="min-h-[84px] w-full resize-none rounded-sm border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition-all duration-300 focus:border-accent md:min-h-0 md:border-0 md:border-b md:bg-transparent md:py-1 md:pl-8 md:font-serif md:text-lg md:italic md:duration-700"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 md:pt-6">
                    <button
                      onClick={() => void onSaveProfile()}
                      className="ml-auto w-full rounded-sm bg-foreground px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-background outline-none transition-all duration-300 hover:bg-accent hover:shadow-xl md:w-auto md:px-14 md:py-5 md:text-[11px] md:font-bold md:tracking-[0.3em] md:duration-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 md:space-y-8">
                <div className="flex items-center gap-3 md:gap-4">
                  <CreditCard className="h-4 w-4 text-accent opacity-60 md:h-5 md:w-5" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-accent md:small-caps md:text-[11px] md:font-bold md:tracking-[0.2em]">Order History</p>
                </div>

                {customerOrders.length > 0 ? (
                  <div className="space-y-2 md:space-y-4">
                    {customerOrders.map((order) => (
                      <div
                        key={order.id}
                        className="liquid-glass group flex items-center justify-between border border-border p-3 transition-all duration-300 hover:shadow-editorial md:p-8 md:duration-700"
                      >
                        <div className="space-y-0.5 md:space-y-1">
                          <p className="text-[10px] font-medium text-accent/70 md:small-caps md:text-[9px] md:font-bold md:tracking-[0.2em] md:text-accent/60">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm font-semibold uppercase tracking-tight text-foreground transition-colors group-hover:text-accent md:font-serif md:text-xl">
                            {order.orderCode}
                          </p>
                        </div>
                        <div className="space-y-1 text-right md:space-y-2">
                          <p className="text-sm font-semibold text-foreground md:font-serif md:text-xl md:italic">{formatUsd(order.total)}</p>
                          <span className="bg-foreground px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-background md:small-caps md:px-3 md:font-bold">{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-sm border-2 border-dashed border-border/40 py-10 text-center md:py-20">
                    <p className="text-sm text-muted-foreground/60 md:font-serif md:text-lg md:italic md:opacity-30">
                      No order history found.
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
