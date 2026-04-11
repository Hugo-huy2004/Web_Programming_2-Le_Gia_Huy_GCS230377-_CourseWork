import type { MetalType, Product } from "../types/product"
import type {
  Appointment,
  Order,
  StoreSettings,
  GoldPriceEntry,
  GoldApiRecord
} from "../types/store"
import type {
  AppointmentDto,
  OrderDto,
  ProductDto,
  SettingsDto,
} from "./api"

export const storageKeys = {
  cart: "hwj_cart",
  admins: "hwj_admin_accounts",
  currentAdmin: "hwj_current_admin",
  customers: "hwj_customers",
  activeCustomerEmail: "hwj_active_customer_email",
  posts: "hwj_posts",
  support: "hwj_support_tickets",
} as const

export const defaultSettings: StoreSettings = {
  shipperFee: 25,
  dollarsPerPoint: 100,
  minimumPointsToRedeem: 10,
  pickupAddress: "HWJ Headquarters, 20 Cong Hoa Garden, Tan Binh Ward, HCMC",
}

export const GOLD_API_URL = "https://www.vang.today/api/prices"
export const SILVER_API_URL = import.meta.env.VITE_SILVER_API_URL ?? "https://api.gold-api.com/price/XAG"
export const DEFAULT_XAUUSD_PER_OUNCE = 3000
export const DEFAULT_XAGUSD_PER_OUNCE = 35
export const GRAMS_PER_TROY_OUNCE = 31.1034768
export const GRAMS_PER_CHI = 3.75
export const SILVER_MARKUP_RATE = 0.3

export const METAL_PURITY: Record<MetalType, number> = {
  "24K": 1 + 0.3,
  "18K": 0.75 + 0.3,
  "14K": 0.585 + 0.3,
  "10K": 0.417 + 0.3,
  "Silver9999": 1,
}

export function readStorage<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`
}

export function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value)
  return !Number.isFinite(parsed) ? fallback : parsed
}

export function normalizeMetalType(value: unknown): MetalType {
  if (value === "24K" || value === "18K" || value === "14K" || value === "10K" || value === "Silver9999") {
    return value
  }
  return "24K"
}

export function sanitizeDiscount(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0
  return value >= 95 ? 95 : Math.round(value)
}

export function sanitizePositiveInteger(value: number): number {
  return !Number.isFinite(value) || value <= 0 ? 0 : Math.floor(value)
}

// Product helpers
export function createOrderCode(): string {
  const now = new Date()
  const yyyy = String(now.getFullYear())
  const mm = String(now.getMonth() + 1).padStart(2, "0")
  const dd = String(now.getDate()).padStart(2, "0")
  const random = String(Math.floor(1000 + Math.random() * 9000))
  return `ORD-${yyyy}${mm}${dd}-${random}`
}

// Gold price parsing
export function parseGoldRows(rawPrices: Record<string, any> | undefined): GoldPriceEntry[] {
  if (!rawPrices) return []

  return Object.entries(rawPrices)
    .map(([code, item]: [string, GoldApiRecord]) => ({
      code,
      name: item?.name ?? code,
      buy: toNumber(item?.buy, 0),
      sell: toNumber(item?.sell, 0),
      currency: item?.currency ?? "USD",
    }))
    .filter((item) => item.sell > 0 || item.buy > 0)
}

export function pickWorldGoldSource(rows: GoldPriceEntry[]): GoldPriceEntry | null {
  const exact = rows.find((row) => row.code === "XAUUSD")
  if (exact) return exact

  const byName = rows.find((row) => row.name.toLowerCase().includes("xau"))
  if (byName) return byName

  return rows.find((row) => row.currency === "USD") ?? null
}

// DTO mappers
export function mapAppointmentDto(input: AppointmentDto): Appointment {
  return {
    id: input._id,
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    date: input.date,
    time: input.time,
    service: input.service,
    note: input.note,
    status: input.status,
    createdAt: input.createdAt,
  }
}

export function mapOrderDto(input: OrderDto): Order | null {
  const id = String(input._id ?? "").trim()
  const orderCode = String(input.orderCode ?? "").trim()
  const customerEmail = String(input.customerEmail ?? "").trim().toLowerCase()

  if (!id || !orderCode || !customerEmail || !Array.isArray(input.items) || input.items.length === 0) {
    return null
  }

  return {
    id,
    orderCode,
    customerEmail,
    status: input.status,
    createdAt: String(input.createdAt ?? new Date().toISOString()),
    items: input.items.map((item) => ({
      productId: String(item.productId ?? "").trim(),
      productCode: String(item.productCode ?? "").trim(),
      name: String(item.name ?? "").trim(),
      price: Math.max(0, toNumber(item.price, 0)),
      quantity: Math.max(1, Math.floor(toNumber(item.quantity, 1))),
    })),
    subtotal: Math.max(0, toNumber(input.subtotal, 0)),
    shippingMethod: input.shippingMethod,
    shippingFee: Math.max(0, toNumber(input.shippingFee, 0)),
    shippingAddress: String(input.shippingAddress ?? "").trim(),
    receiverName: String(input.receiverName ?? "").trim(),
    receiverPhone: String(input.receiverPhone ?? "").trim(),
    note: String(input.note ?? "").trim(),
    voucherCode: typeof input.voucherCode === "string" && input.voucherCode.trim() ? input.voucherCode.trim() : null,
    voucherDiscount: Math.max(0, toNumber(input.voucherDiscount, 0)),
    pointsUsed: Math.max(0, Math.floor(toNumber(input.pointsUsed, 0))),
    pointsDiscount: Math.max(0, toNumber(input.pointsDiscount, 0)),
    tax: Math.max(0, toNumber(input.tax, 0)),
    taxRate: Math.max(0, toNumber(input.taxRate, 0.10)),
    total: Math.max(0, toNumber(input.total, 0)),
    paymentMethod: input.paymentMethod,
    paymentStatus: "paid",
    paypalOrderId: String(input.paypalOrderId ?? "").trim() || "MANUAL",
    rewardPointsGranted: Boolean(input.rewardPointsGranted),
    inventoryReserved: input.inventoryReserved !== false,
  }
}

export function mapSettingsDto(input: SettingsDto): StoreSettings {
  return {
    shipperFee: Math.max(0, toNumber(input.shipperFee, defaultSettings.shipperFee)),
    dollarsPerPoint: Math.max(1, toNumber(input.dollarsPerPoint, defaultSettings.dollarsPerPoint)),
    minimumPointsToRedeem: Math.max(
      0,
      sanitizePositiveInteger(toNumber(input.minimumPointsToRedeem, defaultSettings.minimumPointsToRedeem))
    ),
    pickupAddress: String(input.pickupAddress ?? defaultSettings.pickupAddress).trim() || defaultSettings.pickupAddress,
  }
}

export function mapProductDto(input: ProductDto): Product | null {
  const productCode = String(input.productCode ?? "").trim()
  const name = String(input.name ?? "").trim()

  if (!productCode || !name) return null

  return {
    id: String(input._id ?? productCode).trim(),
    productCode,
    name,
    category: String(input.category ?? "Other").trim() || "Other",
    metalType: normalizeMetalType(input.metalType),
    weightChi: Math.max(0, toNumber(input.weightChi, 0)),
    makingFee: Math.max(0, toNumber(input.makingFee, 0)),
    stock: Math.max(0, Math.floor(toNumber(input.stock, 0))),
    imageUrl: String(input.imageUrl ?? "").trim(),
    description: String(input.description ?? "").trim(),
    isNew: Boolean(input.isNew),
    discountPercent: sanitizeDiscount(toNumber(input.discountPercent, 0)),
  }
}
