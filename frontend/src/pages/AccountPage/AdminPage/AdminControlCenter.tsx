import ProductTab from "@/pages/AccountPage/AdminPage/adminTabs/ProductTab"
import OrderTab from "@/pages/AccountPage/AdminPage/adminTabs/OrderTab"
import AppointmentTab from "@/pages/AccountPage/AdminPage/adminTabs/AppointmentTab"
import SettingTab from "@/pages/AccountPage/AdminPage/adminTabs/SettingTab"
import CustomerTab from "@/pages/AccountPage/AdminPage/adminTabs/CustomerTab"
import SupportTab from "@/pages/AccountPage/AdminPage/adminTabs/SupportTab"
import { motion, AnimatePresence } from "framer-motion"
import { Archive, Calendar, ClipboardList, HelpCircle, LogOut, Settings, Users } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useOrderStore } from "@/stores/useOrderStore"
import { useAppointmentStore } from "@/stores/useAppointmentStore"
import { useAppStore } from "@/stores/useAppStore"
import type { AdminAccount } from "@/types/auth"
import { ADMIN_TAB_DEFINITIONS, type AdminTabId } from "@/constants/adminTabs"
import { AdminFilterBar } from "@/components/admin/AdminFilterBar"
import { ORDER_STATUS_OPTIONS, SUPPORT_STATUS_OPTIONS } from "@/constants/statusOptions"
import type { OrderStatus, SupportStatus } from "@/types/store"
import { formatSupportStatusLabel } from "@/lib/formatUtils"

interface AdminControlCenterProps {
  currentAdmin: AdminAccount
  handleLogout: () => void
}

type AdminFilterConfig = {
  searchLabel: string
  searchPlaceholder: string
  searchValue: string
  onSearchChange: (value: string) => void
  statusLabel: string
  statusValue: string
  onStatusChange: (value: string) => void
  statusOptions: Array<{ value: string; label: string }>
}

const getTabCount = (
  countKey: "pendingOrders" | "newAppointments" | "unresolvedSupport" | undefined,
  pendingCount: number,
  newCount: number,
  unresolvedSupportCount: number
): number | undefined => {
  if (countKey === "pendingOrders") return pendingCount
  if (countKey === "newAppointments") return newCount
  if (countKey === "unresolvedSupport") return unresolvedSupportCount
  return undefined
}

const AdminControlCenter = ({ currentAdmin, handleLogout }: AdminControlCenterProps) => {
  // 1) UI state for current tab and per-tab filters.
  const [activeTab, setActiveTab] = useState<AdminTabId>("products")
  const [orderSearch, setOrderSearch] = useState("")
  const [orderStatusFilter, setOrderStatusFilter] = useState<"all" | OrderStatus>("all")
  const [supportSearch, setSupportSearch] = useState("")
  const [supportStatusFilter, setSupportStatusFilter] = useState<"all" | SupportStatus>("all")

  // 2) Store bindings and live badge counters.
  const fetchOrders = useOrderStore((state) => state.fetchOrders)
  const pendingCount = useOrderStore((state) => state.orders.filter((order) => order.status === "pending").length)
  const fetchAppointments = useAppointmentStore((state) => state.fetchAppointments)
  const newCount = useAppointmentStore((state) => state.appointments.filter((appointment) => appointment.status === "new").length)
  const fetchSupportTickets = useAppStore((state) => state.fetchSupportTickets)
  const unresolvedSupportCount = useAppStore((state) =>
    state.supportTickets.filter((ticket) => ticket.status !== "resolved").length
  )

  useEffect(() => {
    // 3) Initial data hydration and support auto-refresh cycle.
    void fetchOrders(currentAdmin.username, null)
    void fetchAppointments()
    void fetchSupportTickets()

    const intervalId = window.setInterval(() => {
      void fetchSupportTickets()
    }, 20000)

    return () => window.clearInterval(intervalId)
  }, [fetchOrders, fetchAppointments, fetchSupportTickets, currentAdmin.username])

  const iconMap = {
    archive: Archive,
    clipboard: ClipboardList,
    calendar: Calendar,
    help: HelpCircle,
    users: Users,
    settings: Settings,
  } as const

  const tabs = useMemo(
    () =>
      ADMIN_TAB_DEFINITIONS.map((tab) => {
        return {
          ...tab,
          icon: iconMap[tab.iconName],
          count: getTabCount(tab.countKey, pendingCount, newCount, unresolvedSupportCount),
        }
      }),
    [pendingCount, newCount, unresolvedSupportCount]
  )

  // 4) Resolve filter config by active tab (orders/support only).
  const activeFilterConfig = useMemo<AdminFilterConfig | null>(() => {
    if (activeTab === "orders") {
      return {
        searchLabel: "Search Orders",
        searchPlaceholder: "Order code, customer email or receiver...",
        searchValue: orderSearch,
        onSearchChange: setOrderSearch,
        statusLabel: "Order Status",
        statusValue: orderStatusFilter,
        onStatusChange: (value) => setOrderStatusFilter(value as OrderStatus | "all"),
        statusOptions: [
          { value: "all", label: "All Orders" },
          ...ORDER_STATUS_OPTIONS.map((status) => ({ value: status, label: status })),
        ],
      }
    }

    if (activeTab === "supportTickets") {
      return {
        searchLabel: "Search Support Tickets",
        searchPlaceholder: "Customer email or support message...",
        searchValue: supportSearch,
        onSearchChange: setSupportSearch,
        statusLabel: "Ticket Status",
        statusValue: supportStatusFilter,
        onStatusChange: (value) => setSupportStatusFilter(value as SupportStatus | "all"),
        statusOptions: [
          { value: "all", label: "All Tickets" },
          ...SUPPORT_STATUS_OPTIONS.map((status) => ({
            value: status,
            label: formatSupportStatusLabel(status),
          })),
        ],
      }
    }

    return null
  }, [activeTab, orderSearch, orderStatusFilter, supportSearch, supportStatusFilter])

  // 5) Render active tab content with mapped filter inputs.
  const renderActiveTabContent = () => {
    if (activeTab === "products") return <ProductTab />
    if (activeTab === "orders") return <OrderTab searchValue={orderSearch} statusFilter={orderStatusFilter} />
    if (activeTab === "appointments") return <AppointmentTab />
    if (activeTab === "customers") return <CustomerTab />
    if (activeTab === "supportTickets") {
      return <SupportTab searchValue={supportSearch} statusFilter={supportStatusFilter} />
    }
    return <SettingTab />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8 md:space-y-12"
    >
      <div className="flex flex-col justify-between gap-3 rounded-sm border border-border bg-background p-4 md:flex-row md:items-center">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Admin panel</p>
          <h2 className="text-lg font-semibold text-foreground sm:text-xl md:text-2xl">
            {currentAdmin?.username || "System Guest"}
          </h2>
        </div>
        <button
          onClick={handleLogout}
          className="group flex w-full items-center justify-center gap-2 rounded-sm border border-border px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:border-destructive hover:text-destructive md:w-auto"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      <div className="space-y-6 md:space-y-10">
        <div className="scrollbar-hide flex items-center gap-2 overflow-x-auto rounded-sm border border-border bg-background p-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 whitespace-nowrap rounded-sm px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {activeFilterConfig && (
          <AdminFilterBar
            searchLabel={activeFilterConfig.searchLabel}
            searchPlaceholder={activeFilterConfig.searchPlaceholder}
            searchValue={activeFilterConfig.searchValue}
            onSearchChange={activeFilterConfig.onSearchChange}
            statusLabel={activeFilterConfig.statusLabel}
            statusValue={activeFilterConfig.statusValue}
            onStatusChange={activeFilterConfig.onStatusChange}
            statusOptions={activeFilterConfig.statusOptions}
          />
        )}

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.5 }}
            >
              {renderActiveTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default AdminControlCenter
