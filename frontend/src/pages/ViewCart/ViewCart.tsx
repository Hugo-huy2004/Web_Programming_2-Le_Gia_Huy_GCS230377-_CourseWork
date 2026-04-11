import { AnimatePresence } from "framer-motion"
import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { CartItemCard } from "@/components/cart/CartItemCard"
import { CartSummaryCard } from "@/components/cart/CartSummaryCard"
import { EmptyCartState } from "@/components/cart/EmptyCartState"
import { useCartStore } from "@/stores/useCartStore"
import { useProductStore } from "@/stores/useProductStore"
import { useCustomerStore } from "@/stores/useCustomerStore"
import { useSettingsStore } from "@/stores/useSettingsStore"
import { formatUsd } from "@/lib/formatUtils"
import type { Product } from "@/types/product"

const ViewCart = () => {
  const navigate = useNavigate()
  const { cartItems, updateCartQuantity, removeFromCart, clearCart, getCartTotal } = useCartStore()
  const { products, getProductPricing } = useProductStore()
  const { activeCustomerEmail } = useCustomerStore()
  const { currentAdmin } = useSettingsStore()

  const cartTotalValue = getCartTotal()

  useEffect(() => {
    if (!activeCustomerEmail && !currentAdmin) {
      navigate("/user")
    }
  }, [activeCustomerEmail, currentAdmin, navigate])

  const detailedItems = useMemo(() => {
    return cartItems
      .map((cartItem: { productId: string; quantity: number }) => {
        const product = products.find((item: Product) => item.id === cartItem.productId)
        if (!product) return null

        return {
          ...cartItem,
          productCode: product.productCode,
          name: product.name,
          imageUrl: product.imageUrl,
          stock: product.stock,
          unitPrice: getProductPricing(product).finalPrice,
        }
      })
      .filter(
        (
          item
        ): item is {
          productId: string
          quantity: number
          productCode: string
          name: string
          imageUrl: string
          stock: number
          unitPrice: number
        } => item !== null
      )
  }, [cartItems, products, getProductPricing])

  if (cartItems.length === 0) {
    return <EmptyCartState />
  }

  return (
    <div className="relative space-y-4 pb-6 mx-auto w-full max-w-[1400px] px-6 md:px-12">
      {/* Botanical Background Elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-l from-accent/5 to-transparent rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
      
      <div className="relative z-10 space-y-6 pt-10 md:pt-16">
        <header className="border-b border-border pb-6 space-y-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60">Acquisition Summary</p>
              <h1 className="font-serif text-4xl md:text-6xl text-foreground tracking-tighter leading-none">Your Curation</h1>
            </div>
            {activeCustomerEmail && (
               <div className="flex flex-col md:items-end">
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent">Verified Collector</p>
                  <p className="text-lg font-serif italic text-foreground">{activeCustomerEmail}</p>
               </div>
            )}
          </div>
        </header>

        <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start pt-6">
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {detailedItems.map((item) => (
                <CartItemCard
                  key={item.productId}
                  item={item}
                  formatUsd={formatUsd}
                  onRemove={removeFromCart}
                  onUpdateQuantity={updateCartQuantity}
                />
              ))}
            </AnimatePresence>

            <div className="pt-8 flex justify-end">
               <button 
                 onClick={() => clearCart()}
                 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50 hover:text-accent transition-colors border-b border-transparent hover:border-accent pb-1"
               >
                 Clear Personal Curation
               </button>
            </div>
          </div>

          <CartSummaryCard
            activeCustomerEmail={activeCustomerEmail}
            cartTotalValue={cartTotalValue}
            formatUsd={formatUsd}
            onCheckout={() => navigate(activeCustomerEmail ? "/confirm" : "/user")}
          />
        </div>
      </div>
    </div>
  )
}

export default ViewCart
