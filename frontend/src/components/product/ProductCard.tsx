import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import type { Product } from "@/types/product"
import type { ProductPricing } from "@/types/store"

type ProductCardProps = {
  product: Product
  index: number
  pricing: ProductPricing
  inCartQuantity: number
  formatUsd: (value: number) => string
  onAddToCart: (e: React.MouseEvent<HTMLButtonElement>, input: { id: string; imageUrl: string; stock: number }) => void
}

export function ProductCard({ product, index, pricing, inCartQuantity, formatUsd, onAddToCart }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0
  const reachedCartLimit = inCartQuantity >= product.stock
  const buttonLabel = isOutOfStock ? "Sold Out" : reachedCartLimit ? "In Portfolio" : "Acquire"

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.04 }}
      className="group relative flex h-full flex-col rounded-xl border border-border/40 bg-gradient-to-b from-background to-muted/10 p-2.5 shadow-[0_20px_45px_-38px_rgba(0,0,0,0.35)] transition-all duration-500 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border/50 bg-secondary/50 transition-all duration-700 group-hover:border-accent/40 group-hover:shadow-lg md:rounded-md md:border-border">
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1.5 md:left-4 md:top-4 md:gap-2">
          {product.isNew && (
            <span className="rounded-sm bg-foreground px-2 py-0.5 text-[7px] font-bold uppercase tracking-widest text-background md:text-[8px]">New</span>
          )}
          {pricing.discountPercent > 0 && (
            <span className="rounded-sm bg-accent px-2 py-0.5 text-[7px] font-bold uppercase tracking-widest text-white md:text-[8px]">-{pricing.discountPercent}%</span>
          )}
        </div>

        <Link to={`/product/${product.id}`} className="block h-full w-full p-3 md:p-8">
          <motion.img
            src={product.imageUrl}
            alt={product.name}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full object-contain mix-blend-multiply"
          />
        </Link>

        <div className="absolute inset-x-0 bottom-0 translate-y-full transform p-3 transition-transform duration-500 ease-out lg:group-hover:translate-y-0">
          <button
            onClick={(e) => onAddToCart(e, { id: product.id, imageUrl: product.imageUrl, stock: product.stock })}
            disabled={isOutOfStock || reachedCartLimit}
            className="hidden w-full rounded-sm bg-foreground/95 py-3.5 text-[10px] font-bold uppercase tracking-widest text-background shadow-xl backdrop-blur-md transition-all hover:bg-accent hover:text-white disabled:opacity-30 lg:block"
          >
            {buttonLabel}
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-1 flex-col px-1 text-center font-sans tracking-tight md:mt-4">
        <p className="mb-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 md:text-[10px] md:tracking-widest">{product.category}</p>
        <Link to={`/product/${product.id}`} className="group/link mb-1.5 block">
          <h2 className="line-clamp-2 font-serif text-[15px] leading-snug tracking-tight text-foreground transition-colors group-hover/link:text-accent md:text-lg lg:text-xl">
            {product.name}
          </h2>
        </Link>

        <p className="mb-auto hidden font-mono text-[7px] font-bold uppercase tracking-widest text-muted-foreground/40 sm:block md:text-[8px]">
          Ref. {product.id.slice(-6).toUpperCase()} <span className="mx-1 opacity-20 md:mx-2">|</span> {product.metalType} <span className="mx-1 opacity-20 md:mx-2">|</span> {product.weightChi} mace
        </p>

        <div className="mt-auto flex items-center justify-center gap-2 pt-2.5 md:pt-4">
          {pricing.discountPercent > 0 && (
            <p className="font-serif text-[10px] italic text-muted-foreground line-through opacity-50 md:text-[12px]">
              {formatUsd(pricing.oldPrice)}
            </p>
          )}
          <p className="font-serif text-[1.05rem] italic tracking-tighter text-foreground md:text-lg lg:text-xl">
            {formatUsd(pricing.finalPrice)}
          </p>
        </div>

        <button
          onClick={(e) => onAddToCart(e, { id: product.id, imageUrl: product.imageUrl, stock: product.stock })}
          disabled={isOutOfStock || reachedCartLimit}
          className="mt-3.5 w-full rounded-md border border-border/60 py-2.5 text-[9px] font-bold uppercase tracking-[0.18em] text-foreground transition-all hover:border-accent hover:text-accent active:bg-accent/10 disabled:opacity-30 md:mt-4 lg:hidden"
        >
          {buttonLabel}
        </button>
      </div>
    </motion.article>
  )
}
