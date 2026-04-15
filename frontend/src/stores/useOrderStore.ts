import { create } from 'zustand'
import type { Order, OrderStatus, PlaceOrderInput, OrderItem } from '../types/store'
import { mapOrderDto, createOrderCode, sanitizePositiveInteger } from '../lib/storeUtils'
import { orderApiService } from '../services/orderApiService'
import { useProductStore } from './useProductStore'
import { useSettingsStore } from './useSettingsStore'
import { useVoucherStore } from './useVoucherStore'
import { useCartStore } from './useCartStore'
import { useCustomerStore } from './useCustomerStore'

interface OrderStoreState {
  orders: Order[]

  setOrders: (orders: Order[]) => void
  fetchOrders: (currentAdmin: string | null, activeCustomerEmail: string | null) => Promise<void>
  placeOrder: (input: PlaceOrderInput) => Promise<{ ok: boolean; message: string; orderId?: string; orderCode?: string }>
  updateOrderStatus: (orderId: string, nextStatus: OrderStatus) => Promise<{ ok: boolean; message: string }>
  deleteOrder: (orderId: string) => Promise<{ ok: boolean; message: string }>

  seenStatuses: Record<string, OrderStatus>
  markOrderAsSeen: (orderId: string) => void
  pendingOrderCount: () => number
}

export const useOrderStore = create<OrderStoreState>((set, get) => ({
  orders: [],

  setOrders: (orders: Order[]) => {
    set({ orders })
  },

  fetchOrders: async (currentAdmin: string | null, activeCustomerEmail: string | null) => {
    try {
      const result = await orderApiService.list(currentAdmin, activeCustomerEmail)

      const ordersArr = result.orders || []
      const mapped = ordersArr
        .map((item) => mapOrderDto(item))
        .filter((item): item is Order => item !== null)

      set({ orders: mapped })

      set((state) => {
        const nextSeen = { ...state.seenStatuses }
        let changed = false
        mapped.forEach((o) => {
          if (!nextSeen[o.id]) {
            nextSeen[o.id] = o.status
            changed = true
          }
        })
        return changed ? { seenStatuses: nextSeen } : state
      })
    } catch (error) {
      console.error('[orders-sync-failed]', error)
    }
  },

  placeOrder: async (input) => {
    const productStore = useProductStore.getState()
    const settingsStore = useSettingsStore.getState()
    const voucherStore = useVoucherStore.getState()
    const cartStore = useCartStore.getState()
    const customerStore = useCustomerStore.getState()

    const activeCustomer = customerStore.activeCustomer
    const cartItems = cartStore.cartItems
    const products = productStore.products
    const settings = settingsStore.settings
    const getProductPricing = productStore.getProductPricing
    const getVoucherByCode = voucherStore.getVoucherByCode

    if (!activeCustomer) {
      return {
        ok: false,
        message: 'Please login as customer before checkout.',
      }
    }

    if (cartItems.length === 0) {
      return {
        ok: false,
        message: 'Cart is empty.',
      }
    }

    const orderItems: OrderItem[] = []
    let subtotal = 0

    for (const cartItem of cartItems) {
      const product = products.find((current) => current.id === cartItem.productId)
      if (!product) {
        return {
          ok: false,
          message: 'One of the products in your cart is no longer available.',
        }
      }

      if (cartItem.quantity > product.stock) {
        return {
          ok: false,
          message: `Only ${product.stock} item(s) left for ${product.name}.`,
        }
      }

      const price = getProductPricing(product).finalPrice
      subtotal += price * cartItem.quantity
      orderItems.push({
        productId: product.id,
        productCode: product.productCode,
        name: product.name,
        price,
        quantity: cartItem.quantity,
      })
    }

    const taxRate = 0.1
    const tax = Number((subtotal * taxRate).toFixed(2))
    const shippingFee = input.shippingMethod === 'shipper' ? settings.shipperFee : 0
    const voucher = getVoucherByCode(input.voucherCode ?? '')
    const voucherDiscount = Math.min(voucher?.discountAmount ?? 0, subtotal + tax + shippingFee)
    const availablePoints = activeCustomer.loyaltyPoints
    const safePointsUsed = Math.min(sanitizePositiveInteger(input.pointsToUse ?? 0), availablePoints)
    const pointValueUsd = 1 / Math.max(1, settings.dollarsPerPoint || 1)
    const pointsDiscount = Math.min(
      Number((safePointsUsed * pointValueUsd).toFixed(2)),
      subtotal + tax + shippingFee - voucherDiscount
    )
    const computedTotal = Number(
      Math.max(0, subtotal + tax + shippingFee - voucherDiscount - pointsDiscount).toFixed(2)
    )
    const lockedTotal = Number(input.lockedTotal ?? 0)
    const total = lockedTotal > 0 ? Number(lockedTotal.toFixed(2)) : computedTotal

    const receiverName = input.receiverName.trim()
    const receiverPhone = input.receiverPhone.trim()
    const shippingAddress =
      input.shippingMethod === 'pickup' ? settings.pickupAddress : input.shippingAddress.trim()

    if (!receiverName || !receiverPhone) {
      return {
        ok: false,
        message: 'Receiver name and phone are required.',
      }
    }

    if (input.shippingMethod === 'shipper' && !shippingAddress) {
      return {
        ok: false,
        message: 'Shipping address is required for shipper delivery.',
      }
    }

    const orderCode = createOrderCode()

    const paypalOrderId = String(input.paypalOrderId ?? '').trim()
    if (!paypalOrderId) {
      return {
        ok: false,
        message: 'PayPal authorization is required before placing order.',
      }
    }

    try {
      const result = await orderApiService.create({
        orderCode,
        customerEmail: activeCustomer.email,
        status: 'pending',
        items: orderItems,
        subtotal: Number(subtotal.toFixed(2)),
        shippingMethod: input.shippingMethod,
        shippingFee,
        shippingAddress,
        receiverName,
        receiverPhone,
        note: input.note?.trim() ?? '',
        voucherCode: voucher?.code ?? null,
        voucherDiscount: Number(voucherDiscount.toFixed(2)),
        pointsUsed: safePointsUsed,
        pointsDiscount: Number(pointsDiscount.toFixed(2)),
        total,
        tax,
        taxRate,
        paymentMethod: input.paymentMethod,
        paymentStatus: 'paid',
        paypalOrderId,
        rewardPointsGranted: true,
        inventoryReserved: true,
      })

      const mappedOrder = mapOrderDto(result.order)
      if (!mappedOrder) {
        return { ok: false, message: 'Invalid order response from server.' }
      }

      set((state) => ({
        orders: [mappedOrder, ...state.orders.filter((item) => item.id !== mappedOrder.id)],
      }))

      for (const orderItem of orderItems) {
        productStore.updateProductStock(orderItem.productId, -orderItem.quantity)
      }

      const earnedPoints = Math.floor(total / settings.dollarsPerPoint)
      customerStore.updateCustomerLoyaltyPoints(activeCustomer.email, earnedPoints - safePointsUsed)
      customerStore.updateCustomerSpending(activeCustomer.email, total)

      cartStore.clearCart()

      return {
        ok: true,
        message: result.message,
        orderId: mappedOrder.id,
        orderCode: mappedOrder.orderCode,
      }
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Failed to create order.',
      }
    }
  },

  updateOrderStatus: async (orderId, nextStatus) => {
    const { orders } = get()
    const order = orders.find((item) => item.id === orderId)
    if (!order) {
      return { ok: false, message: 'Order not found.' }
    }

    const settingsStore = useSettingsStore.getState()
    const productStore = useProductStore.getState()
    const customerStore = useCustomerStore.getState()
    const settings = settingsStore.settings

    try {
      const result = await orderApiService.updateStatus(orderId, nextStatus)
      const updated = mapOrderDto(result.order)
      if (!updated) {
        return { ok: false, message: 'Invalid order status response.' }
      }

      if (nextStatus === 'cancelled' && order.inventoryReserved) {
        // restockProducts
        for (const orderItem of order.items) {
          const product = productStore.products.find((item) => item.id === orderItem.productId)
          if (product) {
            productStore.updateProductStock(orderItem.productId, product.stock + orderItem.quantity)
          }
        }
      }

      if (nextStatus === 'delivered' && !order.rewardPointsGranted) {
        const earnedPoints = Math.floor(order.total / settings.dollarsPerPoint)
        if (earnedPoints > 0) {
          customerStore.updateCustomerLoyaltyPoints(order.customerEmail, earnedPoints)
        }
      }

      set((state) => ({
        orders: state.orders.map((current) => (current.id === orderId ? updated : current)),
      }))
      return { ok: true, message: result.message || 'Order status updated.' }
    } catch (error) {
      console.error('[order-status-update-failed]', error)
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Failed to update order status.',
      }
    }
  },

  deleteOrder: async (orderId: string) => {
    try {
      const result = await orderApiService.remove(orderId)
      set((state) => ({
        orders: state.orders.filter((order) => order.id !== orderId),
      }))
      return { ok: true, message: result.message }
    } catch (error) {
      console.error('[order-delete-failed]', error)
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Failed to delete order',
      }
    }
  },

  seenStatuses: {},
  markOrderAsSeen: (orderId: string) => {
    const { orders, seenStatuses } = get()
    const order = orders.find((o) => o.id === orderId)
    if (!order) return

    if (seenStatuses[orderId] !== order.status) {
      set((state) => ({
        seenStatuses: { ...state.seenStatuses, [orderId]: order.status },
      }))
    }
  },
  pendingOrderCount: () => {
    return get().orders.filter((o) => o.status === 'pending').length
  },
}))
