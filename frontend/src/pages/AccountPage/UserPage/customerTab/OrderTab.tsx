import { CustomerOrderTab } from "@/components/customer/tabs/CustomerOrderTab"
import { useMemo } from "react"
import { toast } from "sonner"
import { useOrderStore } from "@/stores/useOrderStore"
import { useProductStore } from "@/stores/useProductStore"
import { useCustomerStore } from "@/stores/useCustomerStore"
import { formatUsd } from "@/lib/formatUtils"
import { generateInvoice } from "@/lib/invoiceUtils"
import type { Order } from "@/types/store"

export function OrderTab() {
  const { orders, seenStatuses, markOrderAsSeen } = useOrderStore()
  const { products } = useProductStore()
  const { activeCustomerEmail } = useCustomerStore()

  const memberOrders = useMemo(() => {
    if (!activeCustomerEmail) return []
    return orders.filter((order) => order.customerEmail === activeCustomerEmail)
  }, [orders, activeCustomerEmail])

  const exportOrderInvoice = (order: Order) => {
    generateInvoice(order, formatUsd, products)
  }

  return (
    <CustomerOrderTab
      memberOrders={memberOrders}
      formatUsd={formatUsd}
      onNotify={(message) => toast.info(message)}
      seenStatuses={seenStatuses}
      onMarkOrderAsSeen={markOrderAsSeen}
      onExportInvoice={exportOrderInvoice}
    />
  )
}
