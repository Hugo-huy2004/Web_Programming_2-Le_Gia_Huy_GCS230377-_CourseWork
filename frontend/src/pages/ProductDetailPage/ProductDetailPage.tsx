import { Link } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useProductStore } from "@/stores/useProductStore"
import { useCartStore } from "@/stores/useCartStore"
import { formatUsd } from "@/lib/formatUtils"
import { MobileAddToCartSheet } from "@/components/product/MobileAddToCartSheet"

const ProductDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, getProductPricing } = useProductStore()
  const { triggerAnimation, addToCart, getCartQuantity } = useCartStore()
  const [showMobileQtyModal, setShowMobileQtyModal] = useState(false)
  const [mobileQty, setMobileQty] = useState(1)
  const detailImageRef = useRef<HTMLImageElement | null>(null)

  const product = products.find((p) => p.id === id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const pricing = product ? getProductPricing(product) : null
  const inCartQuantity = product ? getCartQuantity(product.id) : 0
  const isOutOfStock = product ? product.stock <= 0 : false
  const reachedCartLimit = product ? inCartQuantity >= product.stock : false
  const maxAddableQuantity = product ? Math.max(0, product.stock - inCartQuantity) : 0

  const animateAndAdd = (quantity: number) => {
    if (!product) return
    const fallbackButton = document.getElementById("product-acquire-button")
    const rect = detailImageRef.current?.getBoundingClientRect() ?? fallbackButton?.getBoundingClientRect()
    if (!rect) return
    const flySize = Math.min(64, Math.max(42, rect.width * 0.16))
    triggerAnimation(product.imageUrl, rect.left + rect.width / 2, rect.top + rect.height / 2, flySize)
    addToCart(product.id, product.stock, quantity)
  }

  const handleAddToCart = () => {
    if (!product || isOutOfStock || reachedCartLimit) return
    const isMobile = window.matchMedia("(max-width: 767px)").matches

    if (isMobile) {
      setMobileQty(Math.min(1, maxAddableQuantity || 1))
      setShowMobileQtyModal(true)
      return
    }

    animateAndAdd(1)
  }

  const confirmMobileAdd = () => {
    if (!product) return
    animateAndAdd(Math.min(Math.max(1, mobileQty), maxAddableQuantity))
    setShowMobileQtyModal(false)
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
    <div className="product-detail-shell mx-auto w-full max-w-[1400px] px-3 py-4 md:px-12 md:py-20">
      <nav className="mb-5 md:mb-14">
        <button 
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/80 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/80 transition-all duration-300 hover:border-accent hover:text-foreground md:gap-3 md:rounded-sm md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-[11px] md:font-bold md:tracking-widest md:duration-500"
        >
          <ChevronLeft className="h-4 w-4 transition-transform duration-500 group-hover:-translate-x-1 md:group-hover:-translate-x-2" />
          Go Back
        </button>
      </nav>

      <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-24">
        {/* Luxury Image Showcase */}
        <div className="relative rounded-2xl border border-border/70 bg-secondary/25 p-4 md:rounded-md md:border-border md:p-16 transition-all duration-700 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5">
          {product.isNew && (
            <span className="absolute left-3 top-3 z-10 rounded-sm bg-foreground px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-background shadow-xl md:left-6 md:top-6 md:px-3 md:py-1.5 md:text-[9px] md:tracking-widest">
              New Arrival
            </span>
          )}
          {pricing.discountPercent > 0 && (
            <span className="absolute right-3 top-3 z-10 rounded-sm bg-accent px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-white shadow-xl md:right-6 md:top-6 md:px-3 md:py-1.5 md:text-[9px] md:tracking-widest">
              -{pricing.discountPercent}%
            </span>
          )}
          
          <div className="relative aspect-[4/5] w-full flex items-center justify-center">
            <img
              ref={detailImageRef}
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-contain mix-blend-multiply transition-transform duration-1000 hover:scale-105"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6 pt-0.5 lg:space-y-12 lg:pt-10">
          <div className="space-y-3 lg:space-y-8">
            <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-muted-foreground/50 font-bold">
              Ref. {product.productCode || product.id.slice(-6).toUpperCase()}
            </p>

            <h1 className="text-2xl font-semibold leading-[1.15] tracking-tight text-foreground md:font-serif md:text-5xl lg:text-6xl md:tracking-tighter">
              {product.name}
            </h1>
            
            <p className="max-w-xl text-[13px] leading-[1.75] text-muted-foreground/85 md:text-base md:font-serif md:italic md:leading-[2] md:text-muted-foreground">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-2xl border border-border/60 bg-white/75 p-3 md:rounded-none md:border-x-0 md:border-y md:border-border md:bg-transparent md:px-0 md:py-10 md:gap-x-12 md:gap-y-8">
            <div>
              <p className="mb-1 text-[9px] uppercase tracking-[0.08em] text-muted-foreground/70 md:mb-2 md:text-[10px] md:tracking-widest md:text-muted-foreground/60">Category</p>
              <p className="text-sm font-semibold tracking-tight text-foreground md:font-serif md:text-lg">{product.category}</p>
            </div>
            <div>
              <p className="mb-1 text-[9px] uppercase tracking-[0.08em] text-muted-foreground/70 md:mb-2 md:text-[10px] md:tracking-widest md:text-muted-foreground/60">Metal Profile</p>
              <p className="text-sm font-semibold tracking-tight text-foreground md:font-serif md:text-lg">{product.metalType}</p>
            </div>
            <div>
              <p className="mb-1 text-[9px] uppercase tracking-[0.08em] text-muted-foreground/70 md:mb-2 md:text-[10px] md:tracking-widest md:text-muted-foreground/60">Weight / Mace</p>
              <p className="text-sm font-semibold tracking-tight text-foreground md:font-serif md:text-lg">{product.weightChi} mace</p>
            </div>
            <div>
              <p className="mb-1 text-[9px] uppercase tracking-[0.08em] text-muted-foreground/70 md:mb-2 md:text-[10px] md:tracking-widest md:text-muted-foreground/60">Availability</p>
              <p className={`text-sm font-semibold tracking-tight md:font-serif md:text-lg ${product.stock > 0 ? "text-foreground" : "text-destructive italic"}`}>
                {product.stock > 0 ? `${product.stock} Pieces` : "Out of Archive"}
              </p>
            </div>
          </div>

          <div className="space-y-3 md:space-y-6">
            <div className="flex items-end gap-6">
              <p className="text-3xl font-semibold tracking-tight text-foreground md:font-serif md:text-5xl lg:text-6xl md:tracking-tighter md:italic">
                {formatUsd(pricing.finalPrice)}
              </p>
              {pricing.discountPercent > 0 && (
                <p className="pb-1.5 md:pb-2 text-lg md:text-xl text-muted-foreground line-through italic font-serif opacity-40">
                  {formatUsd(pricing.oldPrice)}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-1 md:space-y-8 md:pt-4">
            <button
              id="product-acquire-button"
              onClick={handleAddToCart}
              disabled={isOutOfStock || reachedCartLimit}
              className="w-full rounded-xl border border-transparent bg-foreground px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-background shadow-xl transition-all duration-300 hover:border-accent hover:bg-accent hover:text-white disabled:pointer-events-none disabled:opacity-30 md:rounded-sm md:px-8 md:py-5 md:text-[11px] md:font-bold md:tracking-[0.2em] md:duration-500 md:shadow-2xl md:hover:shadow-accent/20"
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

      <MobileAddToCartSheet
        open={showMobileQtyModal}
        productName={product.name}
        quantity={mobileQty}
        maxQuantity={maxAddableQuantity}
        onDecrease={() => setMobileQty((prev) => Math.max(1, prev - 1))}
        onIncrease={() => setMobileQty((prev) => Math.min(maxAddableQuantity, prev + 1))}
        onClose={() => setShowMobileQtyModal(false)}
        onConfirm={confirmMobileAdd}
      />
    </div>
  )
}

export default ProductDetailPage
