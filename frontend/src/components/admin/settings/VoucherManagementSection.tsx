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
    <section className="space-y-5 md:space-y-12">
      <div className="border-b border-border/40 pb-3 md:pb-8">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-accent md:mb-3 md:small-caps md:font-medium md:tracking-[0.2em]">Privilege Architecture</p>
        <h2 className="text-lg font-semibold tracking-tight text-foreground md:font-serif md:text-4xl md:italic">Valuation Vouchers</h2>
      </div>

      <div className="liquid-glass grid grid-cols-1 items-end gap-3 rounded-sm border border-border/40 p-3 md:grid-cols-3 md:gap-12 md:p-10">
        <div className="space-y-1.5 md:space-y-4">
          <label className="text-[10px] font-medium text-muted-foreground md:small-caps md:text-[9px] md:font-bold md:tracking-[0.2em]">Manifest Code</label>
          <input
            type="text"
            placeholder="e.g. HERITAGE2024"
            value={voucherCode}
            onChange={(e) => onVoucherCodeChange(e.target.value.toUpperCase())}
            className="h-10 w-full rounded-sm border border-border bg-background px-3 text-sm tracking-[0.08em] outline-none transition-all duration-300 placeholder:text-muted-foreground/35 focus:border-accent md:h-auto md:border-0 md:border-b md:bg-transparent md:px-0 md:py-3 md:font-serif md:text-xl md:tracking-[0.1em] md:placeholder:text-muted-foreground/20 md:duration-700"
          />
        </div>
        <div className="space-y-1.5 md:space-y-4">
          <label className="text-[10px] font-medium text-muted-foreground md:small-caps md:text-[9px] md:font-bold md:tracking-[0.2em]">
            Valuation Reduction ($)
          </label>
          <input
            type="number"
            value={voucherDiscountAmount}
            onChange={(e) => onVoucherDiscountAmountChange(e.target.value)}
            className="h-10 w-full rounded-sm border border-border bg-background px-3 text-sm outline-none transition-all duration-300 focus:border-accent md:h-auto md:border-0 md:border-b md:bg-transparent md:px-0 md:py-3 md:font-serif md:text-xl md:italic md:duration-700"
          />
        </div>
        <button
          onClick={onAddVoucher}
          className="flex h-10 items-center justify-center gap-1.5 rounded-sm border border-foreground px-3 text-[9px] font-semibold uppercase tracking-[0.08em] text-foreground transition-all duration-300 hover:bg-foreground hover:text-white md:h-auto md:gap-3 md:px-0 md:py-5 md:text-[11px] md:font-bold md:tracking-[0.3em] md:duration-700"
        >
          <Ticket className="h-3.5 w-3.5 md:h-4 md:w-4" />
          Authorize Voucher
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <AnimatePresence>
          {vouchers.map((voucher) => (
            <motion.div
              layout
              key={voucher.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group liquid-glass flex flex-col justify-between border border-border p-3 transition-all duration-300 hover:shadow-editorial md:p-8 md:duration-700"
            >
              <div className="space-y-3 md:space-y-6">
                <div className="flex items-start justify-between">
                  <h4 className="text-base font-semibold uppercase tracking-[0.08em] text-foreground transition-colors group-hover:text-accent md:font-serif md:text-2xl md:font-bold md:tracking-[0.1em]">
                    {voucher.code}
                  </h4>
                  <span
                    className={`px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.06em] md:small-caps md:px-3 md:text-[9px] md:font-bold ${
                      voucher.active ? "bg-accent text-white" : "bg-muted text-muted-foreground/60"
                    }`}
                  >
                    {voucher.active ? "Active Status" : "Archived Status"}
                  </span>
                </div>
                <p className="text-base font-semibold text-foreground md:font-serif md:text-3xl md:italic">{formatUsd(voucher.discountAmount)}</p>
              </div>
              <div className="mt-3 flex gap-3 border-t border-border/40 pt-3 md:mt-12 md:gap-6 md:pt-8">
                <button
                  className="flex flex-1 items-center justify-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-foreground transition-colors hover:text-accent md:small-caps md:gap-2 md:text-[10px] md:font-bold"
                  onClick={() => onToggleVoucherStatus(voucher.id)}
                >
                  <Power className={`h-3.5 w-3.5 ${voucher.active ? "text-accent" : "text-muted-foreground/40"}`} />
                  {voucher.active ? "Deactivate" : "Activate"}
                </button>
                <button
                  className="flex items-center justify-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-destructive/50 transition-colors hover:text-destructive md:small-caps md:gap-2 md:text-[10px] md:font-bold md:text-destructive/40"
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
