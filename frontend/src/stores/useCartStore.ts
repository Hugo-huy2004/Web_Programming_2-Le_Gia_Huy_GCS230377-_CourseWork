import { create } from 'zustand'
import { storageKeys, readStorage, writeStorage } from '../lib/storeUtils'
import type { CartItem, ProductPricing } from '../types/store'
import type { Product } from '../types/product'
import { useProductStore } from './useProductStore'

export interface FlyingItem {
  id: string
  imageUrl: string
  startX: number
  startY: number
  width: number
}

interface CartStoreState {
  cartItems: CartItem[]
  addToCart: (productId: string, productStock: number, quantity?: number) => void
  updateCartQuantity: (productId: string, quantity: number, productStock: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  getCartQuantity: (productId: string) => number
  cartCount: () => number
  cartTotal: (products: Product[], getProductPricing: (product: Product) => ProductPricing) => number
  getCartTotal: () => number
  getCartCount: () => number
  
  flyingItems: FlyingItem[]
  triggerAnimation: (imageUrl: string, startX: number, startY: number, width: number) => void
  removeAnimation: (id: string) => void
}

let nextId = 0

export const useCartStore = create<CartStoreState>((set, get) => ({
  cartItems: readStorage<CartItem[]>(storageKeys.cart, []),
  
  addToCart: (productId, productStock, quantity = 1) => {
    if (productStock <= 0) return
    const normalizedQuantity = Math.max(1, Math.floor(quantity))
    const { cartItems } = get()
    const existed = cartItems.find((item) => item.productId === productId)
    if ((existed?.quantity ?? 0) >= productStock) return

    const newCartItems = existed
      ? cartItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(item.quantity + normalizedQuantity, productStock) }
            : item
        )
      : [...cartItems, { productId, quantity: Math.min(normalizedQuantity, productStock) }]

    set({ cartItems: newCartItems })
    writeStorage(storageKeys.cart, newCartItems)
  },

  updateCartQuantity: (productId, quantity, productStock = Infinity) => {
    const { cartItems } = get()
    const safeStock = productStock ?? Infinity
    const nextQuantity = Math.min(Math.max(0, Math.floor(quantity)), safeStock)
    const newCartItems = nextQuantity <= 0
      ? cartItems.filter((item) => item.productId !== productId)
      : cartItems.map((item) =>
          item.productId === productId ? { ...item, quantity: nextQuantity } : item
        )

    set({ cartItems: newCartItems })
    writeStorage(storageKeys.cart, newCartItems)
  },

  removeFromCart: (productId) => {
    const newCartItems = get().cartItems.filter((item) => item.productId !== productId)
    set({ cartItems: newCartItems })
    writeStorage(storageKeys.cart, newCartItems)
  },

  clearCart: () => {
    set({ cartItems: [] })
    writeStorage(storageKeys.cart, [])
  },

  getCartQuantity: (productId) => {
    return get().cartItems.find((item) => item.productId === productId)?.quantity ?? 0
  },

  cartCount: () => {
    return get().cartItems.reduce((total, item) => total + item.quantity, 0)
  },

  cartTotal: (products, getProductPricing) => {
    const { cartItems } = get()
    return Number(
      cartItems
        .reduce((total, item) => {
          const product = products.find((current) => current.id === item.productId)
          if (!product) return total
          return total + getProductPricing(product).finalPrice * item.quantity
        }, 0)
        .toFixed(2)
    )
  },

  getCartTotal: () => {
    const { products, getProductPricing } = useProductStore.getState()
    return get().cartTotal(products, getProductPricing)
  },

  getCartCount: () => {
    return get().cartCount()
  },

  flyingItems: [],
  triggerAnimation: (imageUrl, startX, startY, width) => {
    const id = `flying-${Date.now()}-${nextId++}`
    set((state) => ({
      flyingItems: [...state.flyingItems, { id, imageUrl, startX, startY, width }],
    }))
  },
  removeAnimation: (id) => {
    set((state) => ({
      flyingItems: state.flyingItems.filter((item) => item.id !== id),
    }))
  },
}))
