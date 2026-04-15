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
import { useAuthStore } from "@/stores/useAuthStore"
import { formatUsd } from "@/lib/formatUtils"
import { rememberPostLoginRedirect, showAuthToastOnce } from "@/lib/authRedirect"
import type { Product } from "@/types/product"

const ViewCart = () => {
  const navigate = useNavigate()
  const { cartItems, updateCartQuantity, removeFromCart, clearCart, getCartTotal } = useCartStore()
  const { products, getProductPricing } = useProductStore()
  const { activeCustomerEmail } = useCustomerStore()
  const accessToken = useAuthStore((state) => state.accessToken)
  const { currentAdmin } = useSettingsStore()

  const cartTotalValue = getCartTotal()

  useEffect(() => {
    const canAccessAsCustomer = Boolean(activeCustomerEmail && accessToken)
    if (!canAccessAsCustomer && !currentAdmin) {
      rememberPostLoginRedirect()
      showAuthToastOnce("Please sign in to continue.")
      navigate("/user", { replace: true })
    }
  }, [activeCustomerEmail, accessToken, currentAdmin, navigate])

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
    <div className="relative mx-auto w-full max-w-[1400px] space-y-2.5 px-2.5 pb-44 md:space-y-4 md:px-12 md:pb-6">
      {/* Botanical Background Elements */}
      <div className="pointer-events-none absolute -mr-20 -mt-20 hidden h-[400px] w-[400px] rounded-full bg-gradient-to-l from-accent/5 to-transparent blur-3xl md:block" />
      
      <div className="relative z-10 space-y-3 pt-2 md:space-y-6 md:pt-16">
        <header className="space-y-2 border-b border-border/70 pb-3 md:border-border md:pb-6">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end md:gap-6">
            <div className="space-y-1.5 md:space-y-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60 md:text-[10px] md:tracking-[0.4em]">Acquisition Summary</p>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold leading-none tracking-tight text-foreground md:font-serif md:text-6xl md:tracking-tighter">Your Cart</h1>
                <span className="rounded-full border border-border/70 px-2 py-0.5 text-[9px] font-semibold text-muted-foreground md:hidden">
                  {detailedItems.length} items
                </span>
              </div>
            </div>
            {activeCustomerEmail && (
               <div className="flex flex-col md:items-end">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-accent md:tracking-[0.2em]">Verified Collector</p>
                  <p className="max-w-full truncate text-xs text-foreground md:max-w-none md:text-lg md:font-serif md:italic">{activeCustomerEmail}</p>
               </div>
            )}
          </div>
        </header>

        <div className="grid items-start gap-3 pt-1 lg:grid-cols-[1fr_400px] lg:gap-10 lg:pt-6">
          <div className="space-y-3 md:space-y-6">
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

            <div className="flex justify-end pt-1 md:pt-8">
               <button 
                 onClick={() => clearCart()}
                 className="rounded-sm border border-border/60 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/80 transition-colors hover:border-accent hover:text-accent md:border-0 md:px-0 md:py-0 md:border-b md:border-transparent md:pb-1 md:text-[10px] md:tracking-[0.3em]"
               >
                 Clear cart
               </button>
            </div>
          </div>

          <CartSummaryCard
            activeCustomerEmail={activeCustomerEmail}
            cartTotalValue={cartTotalValue}
            itemCount={detailedItems.length}
            formatUsd={formatUsd}
            onCheckout={() => navigate(activeCustomerEmail ? "/confirm" : "/user")}
          />
        </div>
      </div>
    </div>
  )
}

export default ViewCart
