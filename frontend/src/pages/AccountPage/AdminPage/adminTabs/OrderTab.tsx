import { useEffect, useMemo } from "react"
import { AdminEmptyState } from "@/components/admin/AdminEmptyState"
import { OrderAnalyticsCards } from "@/components/admin/orders/OrderAnalyticsCards"
import { OrderLedgerCard } from "@/components/admin/orders/OrderLedgerCard"
import { type Order, type OrderStatus } from "../../../../types/store"
import { useOrderStore } from "@/stores/useOrderStore"
import { useProductStore } from "@/stores/useProductStore"
import { useSettingsStore } from "@/stores/useSettingsStore"
import { generateInvoice } from "@/lib/invoiceUtils"
import { formatUsd } from "@/lib/formatUtils"
import { toSafeArray } from "@/lib/filterUtils"
import { calculateOrderListStats, filterAndSortOrders } from "@/lib/registryUtils"
import { ORDER_STATUS_OPTIONS } from "@/constants/statusOptions"
import { confirmWithToast } from "@/lib/toastConfirm"
import { toast } from "sonner"

type OrderTabProps = {
    searchValue: string
    statusFilter: "all" | OrderStatus
}

const OrderTab = ({ searchValue, statusFilter }: OrderTabProps) => {
    const { orders, updateOrderStatus, fetchOrders, deleteOrder } = useOrderStore()
    const { products } = useProductStore()
    const { currentAdmin } = useSettingsStore()

    const safeOrders = toSafeArray(orders)
    const safeProducts = toSafeArray(products)

    useEffect(() => {
        if (currentAdmin) {
            void fetchOrders(currentAdmin, null)
        }
    }, [fetchOrders, currentAdmin])

    const stats = useMemo(() => {
        return calculateOrderListStats(safeOrders)
    }, [safeOrders])

    const filteredOrders = useMemo(() => {
        return filterAndSortOrders(safeOrders, safeProducts, searchValue, statusFilter)
    }, [searchValue, statusFilter, safeOrders, safeProducts])

    const exportOrderInvoice = (order: Order) => {
        generateInvoice(order, formatUsd, safeProducts)
        toast.success(`Invoice exported: HWJ_Invoice_${order.orderCode}.pdf`)
    }

    const deleteOrderRecord = async (orderId: string) => {
        confirmWithToast({
            message: "Permanently purge this acquisition record from the institutional ledger?",
            confirmLabel: "Purge",
            onConfirm: async () => {
                const result = await deleteOrder(orderId)
                if (result.ok) {
                    toast.success("Order record purged.")
                    return
                }
                toast.error(result.message || "Failed to purge order record.")
            },
        })
    }

    const handleUpdateOrderStatus = async (orderId: string, nextStatus: OrderStatus) => {
        const result = await updateOrderStatus(orderId, nextStatus)
        if (result.ok) {
            toast.success(`Order status updated to ${nextStatus}.`)
            return
        }

        toast.error(result.message || "Failed to update order status.")
    }

    return (
        <div className="animate-in fade-in duration-700 space-y-4 py-3 md:space-y-12 md:py-6 md:duration-1000">
            <OrderAnalyticsCards
                totalRevenueText={formatUsd(stats.totalRevenue)}
                pendingCount={stats.pendingCount}
                totalOrders={stats.totalOrders}
            />
 
            {/* Order Ledger */}
            <div className="space-y-3 md:space-y-6">
                {filteredOrders.length === 0 ? (
                    <AdminEmptyState message="No transactions found in this registry sector." />
                ) : (
                    filteredOrders.map((order: Order) => (
                        <OrderLedgerCard
                            key={order.id}
                            order={order}
                            orderStatusOptions={ORDER_STATUS_OPTIONS}
                            onUpdateOrderStatus={(orderId, nextStatus) => void handleUpdateOrderStatus(orderId, nextStatus)}
                            onExportInvoice={exportOrderInvoice}
                            onDeleteOrder={(orderId) => void deleteOrderRecord(orderId)}
                            formatUsd={formatUsd}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
 
export default OrderTab
