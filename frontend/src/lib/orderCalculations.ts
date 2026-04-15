import type { CartItem } from "../types/store"
import type { Product } from "../types/product"

interface OrderCalculationsProps {
  cartItems: CartItem[]
  products: Product[]
  getProductPricing: (product: Product) => { finalPrice: number }
  shippingMethod: "shipper" | "pickup"
  settings: { shipperFee: number; dollarsPerPoint: number }
  appliedVoucher: { discountAmount: number } | null | undefined
  pointsToUse: string
  availablePoints: number
}

export type CalculatedOrderItem = {
  id: string
  productCode: string
  name: string
  quantity: number
  unitPrice: number
  imageUrl: string
}

export function calculateOrderSummary({
  cartItems,
  products,
  getProductPricing,
  shippingMethod,
  settings,
  appliedVoucher,
  pointsToUse,
  availablePoints,
}: OrderCalculationsProps) {
  const items: CalculatedOrderItem[] = cartItems.flatMap((cartItem: CartItem) => {
    const product = products.find((item: Product) => item.id === cartItem.productId)
    return product
      ? [
          {
            id: product.id,
            productCode: product.productCode,
            name: product.name,
            quantity: cartItem.quantity,
            unitPrice: getProductPricing(product).finalPrice,
            imageUrl: product.imageUrl,
          },
        ]
      : []
  })

  const subtotal = Number(
    items
      .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
      .toFixed(2)
  )

  const canUsePoints = availablePoints > 0
  const normalizedPoints = canUsePoints
    ? Math.min(Math.max(0, Math.floor(Number(pointsToUse) || 0)), availablePoints)
    : 0

  const shippingFee = shippingMethod === "shipper" ? settings.shipperFee : 0
  const taxRate = 0.1
  const tax = Number((subtotal * taxRate).toFixed(2))

  const voucherDiscount = Math.min(appliedVoucher?.discountAmount ?? 0, subtotal + tax + shippingFee)
  const safeDollarsPerPoint = Math.max(1, settings.dollarsPerPoint || 1)
  const pointValueUsd = 1 / safeDollarsPerPoint

  const pointsDiscount = Math.min(
    Number((normalizedPoints * pointValueUsd).toFixed(2)),
    subtotal + tax + shippingFee - voucherDiscount
  )

  const total = Number(
    Math.max(0, subtotal + tax + shippingFee - voucherDiscount - pointsDiscount).toFixed(2)
  )

  return {
    items,
    subtotal,
    tax,
    shippingFee,
    voucherDiscount,
    pointsDiscount,
    total,
    normalizedPoints,
    canUsePoints,
  }
}
