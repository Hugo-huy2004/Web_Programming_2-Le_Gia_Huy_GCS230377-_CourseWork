import { Link } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useProductStore } from "@/stores/useProductStore"
import { useCartStore } from "@/stores/useCartStore"
import { formatUsd } from "@/lib/formatUtils"

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, getProductPricing } = useProductStore()
  const { triggerAnimation, addToCart, getCartQuantity } = useCartStore()

  const product = products.find((p) => p.id === id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const pricing = product ? getProductPricing(product) : null
  const inCartQuantity = product ? getCartQuantity(product.id) : 0
  const isOutOfStock = product ? product.stock <= 0 : false
  const reachedCartLimit = product ? inCartQuantity >= product.stock : false

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!product) return
    const image = e.currentTarget.closest(".product-detail-shell")?.querySelector("img")
    const rect = image?.getBoundingClientRect() ?? e.currentTarget.getBoundingClientRect()
    const flySize = Math.min(72, Math.max(40, rect.width * 0.18))
    triggerAnimation(product.imageUrl, rect.left + rect.width / 2, rect.top + rect.height / 2, flySize)
    addToCart(product.id, product.stock)
  }

  if (!product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-8">
        <p className="font-serif text-4xl text-muted-foreground italic tracking-tighter">Masterpiece Not Found</p>
        <Link 
          to="/collections" 
          className="small-caps text-accent border-b border-accent/30 pb-2 hover:border-accent transition-all duration-700"
        >
          Return to Collections
        </Link>
      </div>
    )
  }

  if (!pricing) return null

  return (
    <div className="product-detail-shell mx-auto w-full max-w-[1400px] px-6 py-12 md:px-12 md:py-24">
      <nav className="mb-12 md:mb-20">
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-foreground transition-all duration-500"
        >
          <ChevronLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-2" />
          Go Back
        </button>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-24 items-start">
        {/* Luxury Image Showcase */}
        <div className="relative rounded-md border border-border bg-secondary/30 p-8 md:p-16 transition-all duration-700 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5">
          {product.isNew && (
            <span className="absolute top-6 left-6 z-10 bg-foreground text-background px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-widest shadow-xl">
              New Arrival
            </span>
          )}
          {pricing.discountPercent > 0 && (
            <span className="absolute top-6 right-6 z-10 bg-accent text-white px-3 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-widest shadow-xl">
              -{pricing.discountPercent}%
            </span>
          )}
          
          <div className="relative aspect-[4/5] w-full flex items-center justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-contain mix-blend-multiply transition-transform duration-1000 hover:scale-105"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-12 pt-4 lg:pt-10">
          <div className="space-y-6 lg:space-y-8">
            <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-muted-foreground/50 font-bold">
              Ref. {product.productCode || product.id.slice(-6).toUpperCase()}
            </p>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tighter leading-[1.1]">
              {product.name}
            </h1>
            
            <p className="text-sm md:text-base leading-[2] text-muted-foreground font-serif italic max-w-xl">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-8 border-y border-border py-8 md:py-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2">Category</p>
              <p className="font-serif text-lg tracking-tight text-foreground">{product.category}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2">Metal Profile</p>
              <p className="font-serif text-lg tracking-tight text-foreground">{product.metalType}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2">Weight / Mace</p>
              <p className="font-serif text-lg tracking-tight text-foreground">{product.weightChi} mace</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2">Availability</p>
              <p className={`font-serif text-lg tracking-tight ${product.stock > 0 ? "text-foreground" : "text-destructive italic"}`}>
                {product.stock > 0 ? `${product.stock} Pieces` : "Out of Archive"}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-end gap-6">
              <p className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tighter italic">
                {formatUsd(pricing.finalPrice)}
              </p>
              {pricing.discountPercent > 0 && (
                <p className="pb-1.5 md:pb-2 text-lg md:text-xl text-muted-foreground line-through italic font-serif opacity-40">
                  {formatUsd(pricing.oldPrice)}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-8 pt-4">
            <button
              id="product-acquire-button"
              onClick={handleAddToCart}
              disabled={isOutOfStock || reachedCartLimit}
              className="w-full rounded-sm border hover:border-accent border-transparent bg-foreground px-8 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-background transition-all duration-500 hover:bg-accent hover:text-white disabled:pointer-events-none disabled:opacity-30 shadow-2xl hover:shadow-accent/20"
            >
              {isOutOfStock ? "Sold Out" : reachedCartLimit ? "In Portfolio" : "Acquire Piece"}
            </button>

            <ul className="space-y-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
              <li className="flex items-center gap-4"><span className="h-px w-4 bg-accent/40"></span> Certified Authenticity</li>
              <li className="flex items-center gap-4"><span className="h-px w-4 bg-accent/40"></span> Complimentary Secure Delivery</li>
              <li className="flex items-center gap-4"><span className="h-px w-4 bg-accent/40"></span> 14-Day Global Returns</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-20 md:mt-32 border-t border-border pt-8 text-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40">
          Material Purity {(pricing.purity * 100).toFixed(1)}% <span className="mx-4 opacity-30">|</span> Market Rate {formatUsd(pricing.basePerChi)}/Mace <span className="mx-4 opacity-30">|</span> Craftsmanship Fee {formatUsd(product.makingFee)}
        </p>
      </div>
    </div>
  )
}

export default ProductDetailPage
