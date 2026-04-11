import {
  listOrdersRequest,
  createOrderRequest,
  updateOrderStatusRequest,
  deleteOrderRequest,
  type CreateOrderPayload,
  type OrderStatus,
} from "../lib/api"

export const orderApiService = {
  list: (currentAdmin: string | null, activeCustomerEmail: string | null) => {
    if (currentAdmin) return listOrdersRequest()
    if (activeCustomerEmail) return listOrdersRequest(activeCustomerEmail)
    return Promise.resolve({ ok: true, orders: [] })
  },
  create: (payload: CreateOrderPayload) => createOrderRequest(payload),
  updateStatus: (id: string, status: OrderStatus) => updateOrderStatusRequest(id, status),
  remove: deleteOrderRequest,
}
