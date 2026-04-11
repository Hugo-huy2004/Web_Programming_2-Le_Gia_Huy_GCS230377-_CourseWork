import type { MetalType } from "./product"

export type CartItem = {
  productId: string
  quantity: number
}

export type AdminAccount = {
  id: string
  username: string
}

export type CustomerProfile = {
  fullName: string
  birthday: string
  phone: string
  address: string
}

export type CustomerAccount = {
  email: string
  profile: CustomerProfile
  loyaltyPoints: number
  totalSpent: number
  totalOrders: number
}

export type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered" | "cancelled"
export type ShippingMethod = "shipper" | "pickup"
export type PaymentMethod = "paypal"

export type OrderItem = {
  productId: string
  productCode: string
  name: string
  price: number
  quantity: number
}

export type Order = {
  id: string
  orderCode: string
  customerEmail: string
  status: OrderStatus
  createdAt: string
  items: OrderItem[]
  subtotal: number
  shippingMethod: ShippingMethod
  shippingFee: number
  shippingAddress: string
  receiverName: string
  receiverPhone: string
  note: string
  voucherCode: string | null
  voucherDiscount: number
  pointsUsed: number
  pointsDiscount: number
  tax: number
  taxRate: number
  total: number
  paymentMethod: PaymentMethod
  paymentStatus: "paid"
  paypalOrderId: string
  rewardPointsGranted: boolean
  inventoryReserved: boolean
}

export type PostItem = {
  id: string
  page: string
  title: string
  content: string
  createdAt: string
}

export type SupportStatus = "open" | "in_progress" | "resolved"

export type SupportTicket = {
  id: string
  customerEmail: string
  message: string
  status: SupportStatus
  createdAt: string
}

export type AppointmentStatus = "new" | "confirmed" | "completed" | "cancelled"

export type Appointment = {
  id: string
  fullName: string
  email: string
  phone: string
  date: string
  time: string
  service: string
  note: string
  status: AppointmentStatus
  createdAt: string
}

export type Voucher = {
  id: string
  code: string
  discountAmount: number
  active: boolean
  createdAt: string
}

export type StoreSettings = {
  shipperFee: number
  dollarsPerPoint: number
  minimumPointsToRedeem: number
  pickupAddress: string
}

export type AddProductInput = {
  name: string
  category: string
  metalType: MetalType
  weightChi: number
  makingFee: number
  stock: number
  imageUrl: string
  description: string
  isNew: boolean
  discountPercent: number
}

export type UpdateProductInput = Partial<AddProductInput>

export type ProductPricing = {
  materialCost: number
  oldPrice: number
  finalPrice: number
  discountPercent: number
  basePerChi: number
  purity: number
}

export type GoldPriceEntry = {
  code: string
  name: string
  buy: number
  sell: number
  currency: string
}

export type GoldPriceSnapshot = {
  date: string
  time: string
  sourceCode: string
  sourceName: string
  pricePerOunce24K: number
  pricePerChi24K: number
  pricePerOunce9999Silver: number
  pricePerChi9999Silver: number
  karatPricePerChi: Record<string, number>
  rows: GoldPriceEntry[]
  lastUpdatedAt: string
}

export type ProfileForm = {
  fullName: string
  birthday: string
  phone: string
  address: string
}

export type PlaceOrderInput = {
  receiverName: string
  receiverPhone: string
  shippingAddress: string
  shippingMethod: ShippingMethod
  note?: string
  voucherCode?: string
  pointsToUse?: number
  paymentMethod: PaymentMethod
  paypalOrderId?: string
}

export type GoldApiRecord = {
  name?: string
  buy?: number
  sell?: number
  currency?: string
}

export type GoldApiResponse = {
  success?: boolean
  date?: string
  time?: string
  prices?: Record<string, GoldApiRecord>
}
