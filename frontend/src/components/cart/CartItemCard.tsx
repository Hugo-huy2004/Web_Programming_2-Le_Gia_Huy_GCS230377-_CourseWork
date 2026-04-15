import { motion } from "framer-motion"

type CartDetailItem = {
  productId: string
  quantity: number
  productCode: string
  name: string
  imageUrl: string
  stock: number
  unitPrice: number
}

type CartItemCardProps = {
  item: CartDetailItem
  formatUsd: (value: number) => string
  onRemove: (productId: string) => void
  onUpdateQuantity: (productId: string, quantity: number, stock: number) => void
}

export function CartItemCard({ item, formatUsd, onRemove, onUpdateQuantity }: CartItemCardProps) {
  const lineTotal = item.unitPrice * item.quantity

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group grid grid-cols-[84px_1fr] gap-2.5 rounded-2xl border border-border/60 bg-white p-2.5 shadow-[0_6px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-accent/25 md:grid-cols-[150px_1fr] md:gap-6 md:rounded-md md:bg-secondary/20 md:p-6 md:shadow-none md:duration-500 md:hover:bg-secondary/40 md:backdrop-blur-2xl md:hover:shadow-2xl"
    >
      <div className="flex h-[96px] items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-background p-1.5 md:h-auto md:aspect-[4/5] md:rounded-sm md:border-border/40 md:p-4">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 md:group-hover:scale-105"
        />
      </div>

      <div className="flex min-w-0 flex-col justify-between py-0 md:py-2">
        <div className="space-y-1 md:space-y-4">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <h2 className="line-clamp-1 text-[13px] font-semibold text-foreground md:font-serif md:text-3xl">{item.name}</h2>
              <p className="mt-0.5 truncate font-mono text-[8px] uppercase tracking-[0.06em] text-muted-foreground/70 md:mt-3 md:pt-2 md:text-[9px] md:font-bold md:tracking-[0.2em]">
                {item.productCode} <span className="mx-1.5 opacity-30">|</span> Stock: {item.stock}
              </p>
            </div>
            <button
              onClick={() => onRemove(item.productId)}
              className="ml-2 rounded-md border border-destructive/20 bg-destructive/10 px-1.5 py-1 text-[8px] font-semibold uppercase tracking-[0.06em] text-destructive transition-colors hover:text-red-700 md:rounded-sm md:border-0 md:px-3 md:py-1.5 md:text-[10px] md:tracking-widest"
            >
              Remove
            </button>
          </div>
          <p className="text-sm font-semibold text-foreground md:font-serif md:text-2xl md:italic">{formatUsd(item.unitPrice)}</p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2 md:items-center md:justify-start md:gap-6 md:pt-6">
          <div className="flex items-center rounded-lg border border-border/80 bg-background p-0.5 md:rounded-sm">
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1, item.stock)}
              className="flex h-7 w-7 items-center justify-center rounded-md text-sm transition-all hover:bg-secondary/60 hover:text-accent md:h-10 md:w-10 md:rounded-sm"
            >
              −
            </button>
            <span className="w-8 text-center font-mono text-xs font-bold md:w-12 md:text-sm">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1, item.stock)}
              disabled={item.quantity >= item.stock}
              className="flex h-7 w-7 items-center justify-center rounded-md text-sm transition-all hover:bg-secondary/60 hover:text-accent disabled:opacity-30 md:h-10 md:w-10 md:rounded-sm"
            >
              +
            </button>
          </div>
          <div className="text-right md:hidden">
            <p className="text-[8px] uppercase tracking-[0.08em] text-muted-foreground/65">Subtotal</p>
            <p className="text-xs font-semibold text-foreground">{formatUsd(lineTotal)}</p>
          </div>
          <p className="hidden text-[8px] uppercase tracking-[0.08em] text-muted-foreground/65 md:block md:text-[9px] md:font-serif md:italic md:tracking-[0.1em]">Qty</p>
        </div>
      </div>
    </motion.article>
  )
}
