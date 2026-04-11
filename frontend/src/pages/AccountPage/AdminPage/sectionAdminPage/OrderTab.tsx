import { useEffect, useMemo, useState } from "react"
import { AdminEmptyState } from "@/components/admin/AdminEmptyState"
import { AdminFilterBar } from "@/components/admin/AdminFilterBar"
import { OrderAnalyticsCards } from "@/components/admin/orders/OrderAnalyticsCards"
import { OrderLedgerCard } from "@/components/admin/orders/OrderLedgerCard"
import { type Order, type OrderStatus } from "../../../../types/store"
import { useOrderStore } from "@/stores/useOrderStore"
import { useProductStore } from "@/stores/useProductStore"
import { useSettingsStore } from "@/stores/useSettingsStore"
import { generateInvoice } from "@/lib/invoiceUtils"
import { formatUsd } from "@/lib/formatUtils"
import { toSafeArray } from "@/lib/filterUtils"
import { calculateOrderRegistryStats, filterOrdersForRegistry } from "@/lib/registryUtils"
import { ORDER_STATUS_OPTIONS } from "@/constants/statusOptions"
import { confirmWithToast } from "@/lib/toastConfirm"
import { toast } from "sonner"

const OrderTab = () => {
    const { orders, updateOrderStatus, fetchOrders, deleteOrder } = useOrderStore()
    const { products } = useProductStore()
    const { currentAdmin } = useSettingsStore()
    const [orderSearch, setOrderSearch] = useState("")
    const [orderStatusFilter, setOrderStatusFilter] = useState<"all" | (typeof ORDER_STATUS_OPTIONS)[number]>("all")

    const safeOrders = toSafeArray(orders)
    const safeProducts = toSafeArray(products)

    useEffect(() => {
        if (currentAdmin) {
            void fetchOrders(currentAdmin, null)
        }
    }, [fetchOrders, currentAdmin])

    const stats = useMemo(() => {
        return calculateOrderRegistryStats(safeOrders)
    }, [safeOrders])

    const filteredOrders = useMemo(() => {
        return filterOrdersForRegistry(safeOrders, safeProducts, orderSearch, orderStatusFilter)
    }, [orderSearch, orderStatusFilter, safeOrders, safeProducts])

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

    return (
        <div className="space-y-12 py-6 animate-in fade-in duration-1000">
            <OrderAnalyticsCards
                totalRevenueText={formatUsd(stats.totalRevenue)}
                pendingCount={stats.pendingCount}
                totalOrders={stats.totalOrders}
            />
 
            <AdminFilterBar
                searchLabel="Search Acquisition Ledger"
                searchPlaceholder="Order Code, Collector Email or Identity..."
                searchValue={orderSearch}
                onSearchChange={setOrderSearch}
                statusLabel="Logistics Filter"
                statusValue={orderStatusFilter}
                onStatusChange={(value) => setOrderStatusFilter(value as OrderStatus | "all")}
                statusOptions={[
                    { value: "all", label: "All Transactions" },
                    ...ORDER_STATUS_OPTIONS.map((opt) => ({ value: opt, label: opt })),
                ]}
            />
 
            {/* Order Ledger */}
            <div className="space-y-6">
                {filteredOrders.length === 0 ? (
                    <AdminEmptyState message="No transactions found in this registry sector." />
                ) : (
                    filteredOrders.map((order: Order) => (
                        <OrderLedgerCard
                            key={order.id}
                            order={order}
                            orderStatusOptions={ORDER_STATUS_OPTIONS}
                            onUpdateOrderStatus={(orderId, nextStatus) => void updateOrderStatus(orderId, nextStatus)}
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
