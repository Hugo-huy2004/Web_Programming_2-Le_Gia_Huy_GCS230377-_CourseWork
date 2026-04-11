import { AnimatePresence, motion } from "framer-motion"
import { Power, Ticket, Trash2 } from "lucide-react"
import type { Voucher } from "@/types/store"

type VoucherManagementSectionProps = {
  vouchers: Voucher[]
  voucherCode: string
  onVoucherCodeChange: (value: string) => void
  voucherDiscountAmount: string
  onVoucherDiscountAmountChange: (value: string) => void
  onAddVoucher: () => void
  onToggleVoucherStatus: (id: string) => void
  onDeleteVoucher: (id: string) => void
  formatUsd: (value: number) => string
}

export function VoucherManagementSection({
  vouchers,
  voucherCode,
  onVoucherCodeChange,
  voucherDiscountAmount,
  onVoucherDiscountAmountChange,
  onAddVoucher,
  onToggleVoucherStatus,
  onDeleteVoucher,
  formatUsd,
}: VoucherManagementSectionProps) {
  return (
    <section className="space-y-12">
      <div className="border-b border-border/40 pb-8">
        <p className="mb-3 small-caps text-[10px] font-medium tracking-[0.2em] text-accent">Privilege Architecture</p>
        <h2 className="font-serif text-4xl italic tracking-tight text-foreground">Valuation Vouchers</h2>
      </div>

      <div className="grid grid-cols-1 items-end gap-12 rounded-sm border border-border/40 bg-secondary/20 p-10 md:grid-cols-3">
        <div className="space-y-4">
          <label className="small-caps text-[9px] font-bold tracking-[0.2em] text-muted-foreground">Manifest Code</label>
          <input
            type="text"
            placeholder="e.g. HERITAGE2024"
            value={voucherCode}
            onChange={(e) => onVoucherCodeChange(e.target.value.toUpperCase())}
            className="w-full border-b border-border bg-transparent py-3 font-serif text-xl tracking-[0.1em] outline-none transition-all duration-700 placeholder:text-muted-foreground/20 focus:border-accent"
          />
        </div>
        <div className="space-y-4">
          <label className="small-caps text-[9px] font-bold tracking-[0.2em] text-muted-foreground">
            Valuation Reduction ($)
          </label>
          <input
            type="number"
            value={voucherDiscountAmount}
            onChange={(e) => onVoucherDiscountAmountChange(e.target.value)}
            className="w-full border-b border-border bg-transparent py-3 font-serif text-xl italic outline-none transition-all duration-700 focus:border-accent"
          />
        </div>
        <button
          onClick={onAddVoucher}
          className="flex items-center justify-center gap-3 rounded-sm border border-foreground py-5 text-[11px] font-bold uppercase tracking-[0.3em] text-foreground transition-all duration-700 hover:bg-foreground hover:text-white"
        >
          <Ticket className="h-4 w-4" />
          Authorize Voucher
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {vouchers.map((voucher) => (
            <motion.div
              layout
              key={voucher.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group flex flex-col justify-between border border-border bg-white p-8 transition-all duration-700 hover:shadow-editorial"
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <h4 className="font-serif text-2xl font-bold uppercase tracking-[0.1em] text-foreground transition-colors group-hover:text-accent">
                    {voucher.code}
                  </h4>
                  <span
                    className={`small-caps px-3 py-1 text-[9px] font-bold ${
                      voucher.active ? "bg-accent text-white" : "bg-muted text-muted-foreground/60"
                    }`}
                  >
                    {voucher.active ? "Active Status" : "Archived Status"}
                  </span>
                </div>
                <p className="font-serif text-3xl italic text-foreground">{formatUsd(voucher.discountAmount)}</p>
              </div>
              <div className="mt-12 flex gap-6 border-t border-border/40 pt-8">
                <button
                  className="small-caps flex flex-1 items-center justify-center gap-2 text-[10px] font-bold text-foreground transition-colors hover:text-accent"
                  onClick={() => onToggleVoucherStatus(voucher.id)}
                >
                  <Power className={`h-3.5 w-3.5 ${voucher.active ? "text-accent" : "text-muted-foreground/40"}`} />
                  {voucher.active ? "Deactivate" : "Activate"}
                </button>
                <button
                  className="small-caps flex items-center justify-center gap-2 text-[10px] font-bold text-destructive/40 transition-colors hover:text-destructive"
                  onClick={() => onDeleteVoucher(voucher.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Terminate
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}
