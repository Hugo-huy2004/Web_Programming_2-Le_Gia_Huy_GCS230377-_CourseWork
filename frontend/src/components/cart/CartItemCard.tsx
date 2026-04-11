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
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group grid gap-6 rounded-md border border-border/50 bg-secondary/20 p-6 backdrop-blur-2xl transition-all duration-700 hover:border-accent/20 hover:bg-secondary/40 hover:shadow-2xl md:grid-cols-[160px_1fr]"
    >
      <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-sm border border-border/40 bg-background p-4">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-[2000ms] group-hover:scale-110"
        />
      </div>

      <div className="flex flex-col justify-between py-2">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="line-clamp-1 font-serif text-2xl text-foreground md:text-3xl">{item.name}</h2>
              <p className="mt-3 pt-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                {item.productCode} <span className="mx-2 opacity-30">|</span> Reserve: {item.stock}
              </p>
            </div>
            <button
              onClick={() => onRemove(item.productId)}
              className="rounded-sm bg-destructive/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-destructive transition-colors hover:text-red-700"
            >
              Remove
            </button>
          </div>
          <p className="font-serif text-2xl italic text-foreground">{formatUsd(item.unitPrice)}</p>
        </div>

        <div className="mt-auto flex items-center gap-6 pt-6">
          <div className="flex items-center rounded-sm border border-border/80 bg-background p-0.5 shadow-sm">
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1, item.stock)}
              className="flex h-10 w-10 items-center justify-center rounded-sm text-sm transition-all hover:bg-secondary/60 hover:text-accent"
            >
              −
            </button>
            <span className="w-12 text-center font-mono text-sm font-bold">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1, item.stock)}
              disabled={item.quantity >= item.stock}
              className="flex h-10 w-10 items-center justify-center rounded-sm text-sm transition-all hover:bg-secondary/60 hover:text-accent disabled:opacity-30"
            >
              +
            </button>
          </div>
          <p className="font-serif text-[9px] italic uppercase tracking-[0.1em] text-muted-foreground/60">
            Units Selected
          </p>
        </div>
      </div>
    </motion.article>
  )
}
