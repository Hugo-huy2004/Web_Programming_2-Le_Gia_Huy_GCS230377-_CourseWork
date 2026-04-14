import type { Product } from "@/types/product"
import { formatUsd } from "@/lib/formatUtils"

interface ProductItemProps {
  product: Product
  pricing: {
    oldPrice: number
    finalPrice: number
    discountPercent: number
  }
  onEdit?: () => void
  onDelete?: () => void
  onRestock?: () => void
}

const ProductItem = ({ product, pricing, onEdit, onDelete }: ProductItemProps) => {
  return (
    <article className="group flex h-full w-full flex-col rounded-sm border border-border bg-background p-3 transition-all duration-300 hover:border-accent md:mx-auto md:max-w-sm md:p-4">
      <div className="mb-2 flex shrink-0 items-start justify-between md:mb-3">
        {product.isNew ? (
          <span className="rounded-sm bg-accent/10 px-1.5 py-0.5 text-[9px] font-medium text-accent">
            New
          </span>
        ) : <div />}
        <span className="max-w-[58%] truncate text-right font-mono text-[9px] text-muted-foreground/70">
          #{product.productCode}
        </span>
      </div>

      <div className="mb-3 flex h-[108px] shrink-0 justify-center overflow-hidden rounded-sm border border-border/30 bg-secondary/20 p-2 md:mb-4 md:h-[140px] md:p-3">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-1000 group-hover:scale-110"
        />
      </div>

      <div className="flex flex-grow flex-col justify-center space-y-1 text-center md:space-y-1.5">
        <h2 className="line-clamp-2 min-h-[2.5rem] text-[14px] font-semibold leading-snug text-foreground md:min-h-[3rem] md:text-base">
          {product.name}
        </h2>
        <p className="text-[11px] text-muted-foreground md:text-xs">
          {product.category} . {product.metalType}
        </p>
      </div>

      <div className="mt-3 flex shrink-0 flex-col gap-2 border-t border-border/40 pt-3 md:mt-4 md:pt-4">
        <div className="flex items-end justify-between gap-2">
          <p className="text-base font-semibold text-foreground md:text-lg">{formatUsd(pricing.finalPrice)}</p>
          <p className={`text-xs font-medium ${product.stock <= 5 ? "text-accent" : "text-muted-foreground"}`}>
            Stock: {product.stock}
          </p>
        </div>

        <div className="flex gap-2 md:gap-4">
          <button
            onClick={() => onEdit?.()}
            className="flex-1 rounded-sm bg-foreground py-2 text-[11px] font-medium text-background transition-colors hover:bg-accent md:py-2.5"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.()}
            className="rounded-sm border border-destructive/30 px-3 py-2 text-[11px] font-medium text-destructive transition-colors hover:bg-destructive hover:text-white md:px-4 md:py-2.5"
          >
            Del
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductItem
