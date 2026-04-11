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
    <article className="mx-auto w-full max-w-sm border border-border bg-background p-6 rounded-sm transition-all duration-700 hover:shadow-editorial hover:border-accent group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4 shrink-0">
        {product.isNew ? (
          <span className="small-caps px-2 py-0.5 text-accent border border-accent bg-accent/5 font-bold">
            New Arrival
          </span>
        ) : <div />}
        <span className="text-[9px] font-mono text-muted-foreground/30 uppercase tracking-[0.2em] font-bold">Registry No. {product.productCode}</span>
      </div>
      
      <div className="flex justify-center h-[160px] bg-secondary/30 rounded-sm p-4 mb-6 shrink-0 border border-border/20 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-1000 group-hover:scale-110"
        />
      </div>

      <div className="space-y-2 text-center flex-grow flex flex-col justify-center">
        <h2 className="font-serif text-lg text-foreground tracking-tight leading-snug line-clamp-2 min-h-[3.5rem] flex items-center justify-center italic group-hover:text-accent transition-colors duration-500">{product.name}</h2>
        <p className="small-caps text-muted-foreground/40 text-[9px] tracking-[0.1em] font-medium">
          {product.category} <span className="mx-2 opacity-20">|</span> {product.metalType}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-border/40 pt-6 shrink-0">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="small-caps text-muted-foreground/30 text-[9px] font-bold tracking-[0.1em]">Certified Valuation</p>
            <p className="font-serif text-2xl text-foreground italic tracking-tighter">{formatUsd(pricing.finalPrice)}</p>
          </div>
          <div className="text-right">
             <p className="small-caps text-muted-foreground/30 text-[9px] font-bold tracking-[0.1em] mb-1">Vault Status</p>
             <p className={`font-mono text-[11px] font-bold ${product.stock <= 5 ? "text-accent" : "text-foreground/40"}`}>
               {product.stock} UNITS
             </p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => onEdit?.()}
            className="flex-1 py-3 bg-foreground text-background text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-accent hover:text-white transition-all duration-700 shadow-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.()}
            className="px-6 py-3 border border-destructive/20 text-destructive text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-destructive hover:text-white transition-all duration-700"
          >
            Del
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductItem
