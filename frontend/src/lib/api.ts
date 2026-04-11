import { readPersistedAccessToken } from "@/lib/authSession"
import type {
  AppointmentStatus,
  OrderStatus,
  ShippingMethod,
  PaymentMethod,
  SupportStatus,
} from "../types/store"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api"
const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY ?? ""

export function isAdminApiKeyConfigured() {
  return Boolean(ADMIN_API_KEY || readPersistedAccessToken())
}

function attachAdminApiKey(headers: Headers) {
  if (ADMIN_API_KEY && !headers.has("x-admin-key")) {
    headers.set("x-admin-key", ADMIN_API_KEY)
  }
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

async function request<T>(path: string, options?: RequestInit & { admin?: boolean }): Promise<T> {
  const { admin, ...requestInit } = options ?? {}
  const isFormData = options?.body instanceof FormData
  const token = readPersistedAccessToken()
  const finalHeaders = new Headers(options?.headers)

  if (admin) {
    attachAdminApiKey(finalHeaders)
  }

  if (options?.body && !isFormData && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json")
  }

  if (token && !finalHeaders.has("Authorization")) {
    finalHeaders.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestInit,
    headers: finalHeaders,
  })

  const contentType = response.headers.get("content-type") ?? ""
  let data: (T & { message?: string }) | null = null
  let rawText = ""

  if (contentType.includes("application/json")) {
    data = (await response.json()) as T & { message?: string }
  } else {
    rawText = await response.text()
  }

  if (!response.ok) {
    const message = data?.message || rawText || `Request failed: ${response.status}`
    throw new Error(message)
  }

  if (!data) {
    throw new Error("Invalid server response format.")
  }

  return data
}

export type AppointmentPayload = {
  fullName: string
  email: string
  phone: string
  date: string
  time: string
  service: string
  note?: string
}

export type AppointmentDto = {
  _id: string
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

export async function createAppointmentRequest(payload: AppointmentPayload) {
  return request<{ ok: boolean; message: string; appointment: AppointmentDto }>("/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function listAppointmentsRequest() {
  return request<{ ok: boolean; appointments: AppointmentDto[] }>("/appointments", { admin: true })
}

export async function updateAppointmentStatusRequest(id: string, status: AppointmentStatus) {
  return request<{ ok: boolean; message: string; appointment: AppointmentDto }>(
    `/appointments/${id}/status`,
    {
      method: "PATCH",
      admin: true,
      body: JSON.stringify({ status }),
    }
  )
}

export async function deleteAppointmentRequest(id: string) {
  return request<{ ok: boolean; message: string }>(`/appointments/${id}`, {
    method: "DELETE",
    admin: true,
  })
}

export type { AppointmentStatus, OrderStatus, ShippingMethod, PaymentMethod, SupportStatus }

export type OrderItemDto = {
  productId: string
  productCode: string
  name: string
  price: number
  quantity: number
}

export type OrderDto = {
  _id: string
  orderCode: string
  customerEmail: string
  status: OrderStatus
  items: OrderItemDto[]
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
  total: number
  paymentMethod: PaymentMethod
  paymentStatus: "paid"
  paypalOrderId: string
  rewardPointsGranted: boolean
  inventoryReserved: boolean
  tax: number
  taxRate: number
  createdAt: string
}

export type CreateOrderPayload = {
  orderCode: string
  customerEmail: string
  status: OrderStatus
  items: OrderItemDto[]
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
  total: number
  paymentMethod: PaymentMethod
  paymentStatus: "paid"
  paypalOrderId: string
  rewardPointsGranted: boolean
  inventoryReserved: boolean
  tax: number
  taxRate: number
}

export async function listOrdersRequest(customerEmail?: string) {
  const query = customerEmail?.trim() ? `?customerEmail=${encodeURIComponent(customerEmail.trim().toLowerCase())}` : ""
  const admin = !customerEmail?.trim()

  return request<{ ok: boolean; orders: OrderDto[] }>(`/orders${query}`, { admin })
}

export async function createOrderRequest(payload: CreateOrderPayload) {
  return request<{ ok: boolean; message: string; order: OrderDto }>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function updateOrderStatusRequest(id: string, status: OrderStatus) {
  return request<{ ok: boolean; message: string; order: OrderDto }>(`/orders/${id}/status`, {
    method: "PATCH",
    admin: true,
    body: JSON.stringify({ status }),
  })
}

export async function deleteOrderRequest(id: string) {
  return request<{ ok: boolean; message: string }>(`/orders/${id}`, {
    method: "DELETE",
    admin: true,
  })
}

export type VoucherDto = {
  _id: string
  code: string
  discountAmount: number
  active: boolean
  createdAt: string
}

export async function listVouchersRequest(includeAll: boolean) {
  return request<{ ok: boolean; vouchers: VoucherDto[] }>("/vouchers", { admin: includeAll })
}

export async function createVoucherRequest(code: string, discountAmount: number) {
  return request<{ ok: boolean; message: string; voucher: VoucherDto }>("/vouchers", {
    method: "POST",
    admin: true,
    body: JSON.stringify({ code, discountAmount }),
  })
}

export async function toggleVoucherStatusRequest(id: string) {
  return request<{ ok: boolean; message: string; voucher: VoucherDto }>(`/vouchers/${id}/toggle`, {
    method: "PATCH",
    admin: true,
  })
}

export async function deleteVoucherRequest(id: string) {
  return request<{ ok: boolean; message: string; deletedId: string }>(`/vouchers/${id}`, {
    method: "DELETE",
    admin: true,
  })
}

export type SettingsDto = {
  _id: string
  shipperFee: number
  dollarsPerPoint: number
  minimumPointsToRedeem: number
  pickupAddress: string
}

export async function getSettingsRequest() {
  return request<{ ok: boolean; settings: SettingsDto }>("/settings")
}

export async function updateSettingsRequest(payload: Partial<Omit<SettingsDto, "_id">>) {
  return request<{ ok: boolean; message: string; settings: SettingsDto }>("/settings", {
    method: "PUT",
    admin: true,
    body: JSON.stringify(payload),
  })
}

export type AdminDto = {
  id: string
  username: string
  createdAt: string
}

export async function listAdminsRequest() {
  return request<{ ok: boolean; admins: AdminDto[] }>("/admins", { admin: true })
}

export async function createAdminAccountRequest(username: string, password: string) {
  return request<{ ok: boolean; message: string; admin: AdminDto }>("/admins", {
    method: "POST",
    admin: true,
    body: JSON.stringify({ username, password }),
  })
}

export type ProductSyncPayload = {
  productCode: string
  name: string
  category: string
  metalType: string
  weightChi: number
  makingFee: number
  discountPercent: number
  stock: number
  imageUrl: string
  description: string
  isNew: boolean
}

export type ProductDto = {
  _id: string
  name: string
  category: string
  metalType: string
  productCode: string
  weightChi: number
  makingFee: number
  discountPercent: number
  stock: number
  imageUrl: string
  description: string
  isNew: boolean
}

export async function listProductsRequest() {
  return request<{ ok: boolean; products: ProductDto[] }>("/products")
}

export async function syncProductsRequest(
  products: ProductSyncPayload[],
  options?: { pruneMissing?: boolean }
) {
  return request<{
    ok: boolean
    message: string
    totalInput: number
    inserted: number
    modified: number
    matched: number
    deleted?: number
  }>("/products/sync", {
    method: "POST",
    admin: true,
    body: JSON.stringify({ products, pruneMissing: Boolean(options?.pruneMissing) }),
  })
}

export async function uploadDriveImageRequest(file: File) {
  const formData = new FormData()
  formData.append("image", file)

  return request<{
    ok: boolean
    message: string
    file: {
      fileId: string
      name: string
      webViewLink: string
      publicUrl: string
    }
  }>("/uploads/drive-image", {
    method: "POST",
    admin: true,
    body: formData,
  })
}

export type CustomerDto = {
  id: string
  email: string
  profile: {
    fullName: string
    birthday: string
    phone: string
    address: string
  }
  loyaltyPoints: number
  totalSpent: number
  totalOrders: number
  createdAt: string
  updatedAt: string
}

export type GoogleCustomerLoginPayload = {
  idToken: string
}

export async function upsertGoogleCustomerRequest(payload: GoogleCustomerLoginPayload) {
  return request<{ ok: boolean; message: string; customer: CustomerDto; accessToken: string }>("/customers/google-login", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function listCustomersRequest() {
  return request<{ ok: boolean; customers: CustomerDto[] }>("/customers", { admin: true })
}

export async function updateCustomerProfileRequest(
  email: string,
  profile: { fullName: string; birthday: string; phone: string; address: string }
) {
  const normalized = normalizeEmail(email)
  return request<{ ok: boolean; message: string; customer: CustomerDto }>(
    `/customers/${encodeURIComponent(normalized)}/profile`,
    {
      method: "PATCH",
      body: JSON.stringify(profile),
    }
  )
}

export async function updateCustomerMetricsRequest(
  email: string,
  payload: { pointsDelta?: number; spentDelta?: number; ordersDelta?: number }
) {
  const normalized = normalizeEmail(email)
  return request<{ ok: boolean; message: string; customer: CustomerDto }>(
    `/customers/${encodeURIComponent(normalized)}/metrics`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  )
}

export type SupportTicketDto = {
  _id: string
  customerEmail: string
  message: string
  status: SupportStatus
  createdAt: string
}

export async function listSupportTicketsRequest() {
  return request<{ ok: boolean; tickets: SupportTicketDto[] }>("/support/tickets", { admin: true })
}

export async function createSupportTicketRequest(email: string, message: string) {
  return request<{ ok: boolean; message: string; ticket: SupportTicketDto }>("/support/tickets", {
    method: "POST",
    body: JSON.stringify({ email, message }),
  })
}

export async function updateSupportTicketStatusRequest(id: string, status: SupportStatus) {
  return request<{ ok: boolean; message: string; ticket: SupportTicketDto }>(
    `/support/tickets/${id}/status`,
    {
      method: "PATCH",
      admin: true,
      body: JSON.stringify({ status }),
    }
  )
}

export async function deleteSupportTicketRequest(id: string) {
  return request<{ ok: boolean; message: string }>(`/support/tickets/${id}`, {
    method: "DELETE",
    admin: true,
  })
}
