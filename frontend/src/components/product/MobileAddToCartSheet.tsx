import { AnimatePresence, motion } from "framer-motion"

type MobileAddToCartSheetProps = {
  open: boolean
  productName: string
  quantity: number
  maxQuantity: number
  onDecrease: () => void
  onIncrease: () => void
  onClose: () => void
  onConfirm: () => void
}

export function MobileAddToCartSheet({
  open,
  productName,
  quantity,
  maxQuantity,
  onDecrease,
  onIncrease,
  onClose,
  onConfirm,
}: MobileAddToCartSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[210] flex items-end bg-black/40 p-2 md:hidden"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full rounded-2xl border border-border/60 bg-white p-4 shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
            initial={{ y: "100%", opacity: 0.95 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.7 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-accent">Select Quantity</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{productName}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold text-muted-foreground"
              >
                Close
              </button>
            </div>

            <div className="mb-4 flex items-center justify-between rounded-xl border border-border/70 bg-secondary/20 px-2 py-2">
              <button
                onClick={onDecrease}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-base"
                disabled={quantity <= 1}
              >
                -
              </button>
              <div className="text-center">
                <p className="text-[9px] uppercase tracking-[0.08em] text-muted-foreground/70">Quantity</p>
                <p className="text-lg font-semibold text-foreground">{quantity}</p>
              </div>
              <button
                onClick={onIncrease}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-base"
                disabled={quantity >= maxQuantity}
              >
                +
              </button>
            </div>

            <p className="mb-3 text-[10px] text-muted-foreground/80">Available to add: {maxQuantity}</p>

            <button
              onClick={onConfirm}
              className="w-full rounded-xl bg-foreground py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-background disabled:opacity-40"
              disabled={maxQuantity <= 0}
            >
              Add {Math.max(1, Math.min(quantity, maxQuantity || 1))} to Cart
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
