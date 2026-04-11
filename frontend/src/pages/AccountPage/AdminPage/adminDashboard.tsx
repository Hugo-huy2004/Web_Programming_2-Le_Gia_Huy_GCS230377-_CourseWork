import ProductTab from "@/pages/AccountPage/AdminPage/sectionAdminPage/ProductTab"
import OrderTab from "@/pages/AccountPage/AdminPage/sectionAdminPage/OrderTab"
import AppointmentTab from "@/pages/AccountPage/AdminPage/sectionAdminPage/AppointmentTab"
import SettingTab from "@/pages/AccountPage/AdminPage/sectionAdminPage/SettingTab"
import CustomerTab from "@/pages/AccountPage/AdminPage/sectionAdminPage/CustomerTab"
import SupportTab from "@/pages/AccountPage/AdminPage/sectionAdminPage/SupportTab"
import { motion, AnimatePresence } from "framer-motion"
import { Archive, Calendar, ClipboardList, HelpCircle, LogOut, Settings, Users } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useOrderStore } from "@/stores/useOrderStore"
import { useAppointmentStore } from "@/stores/useAppointmentStore"
import { useAppStore } from "@/stores/useAppStore"
import type { AdminAccount } from "@/types/auth"
import { ADMIN_TAB_DEFINITIONS, type AdminTabId } from "@/constants/adminTabs"

interface AdminDashboardProps {
  currentAdmin: AdminAccount
  handleLogout: () => void
}

const AdminDashboard = ({ currentAdmin, handleLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<AdminTabId>("products")
  const fetchOrders = useOrderStore((state) => state.fetchOrders)
  const pendingCount = useOrderStore((state) => state.orders.filter((order) => order.status === "pending").length)
  const fetchAppointments = useAppointmentStore((state) => state.fetchAppointments)
  const newCount = useAppointmentStore((state) => state.appointments.filter((appointment) => appointment.status === "new").length)
  const fetchSupportTickets = useAppStore((state) => state.fetchSupportTickets)
  const unresolvedSupportCount = useAppStore((state) =>
    state.supportTickets.filter((ticket) => ticket.status !== "resolved").length
  )

  useEffect(() => {
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
        let count: number | undefined
        if (tab.countKey === "pendingOrders") count = pendingCount
        if (tab.countKey === "newAppointments") count = newCount
        if (tab.countKey === "unresolvedSupport") count = unresolvedSupportCount

        return {
          ...tab,
          icon: iconMap[tab.iconName],
          count,
        }
      }),
    [pendingCount, newCount, unresolvedSupportCount]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-12"
    >
      <div className="flex flex-col justify-between gap-4 rounded-sm border border-border bg-white p-5 shadow-editorial md:flex-row md:items-center md:gap-6 md:p-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <p className="small-caps text-accent text-[11px] tracking-[0.2em] font-medium">Institutional Registry: Authorized Access</p>
          </div>
          <h2 className="font-serif text-2xl text-foreground italic tracking-tight md:text-4xl">
            Curator: {currentAdmin?.username || "System Guest"}
          </h2>
        </div>
        <button
          onClick={handleLogout}
          className="group flex w-full items-center justify-center gap-3 rounded-sm border border-border px-6 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-foreground transition-all duration-700 hover:border-destructive hover:text-destructive md:w-auto md:px-10 md:py-4 md:text-[11px] md:tracking-[0.3em]"
        >
          <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Terminate Session
        </button>
      </div>

      <div className="space-y-10">
        <div className="scrollbar-hide flex items-center gap-4 overflow-x-auto border-b border-border/40 pb-4 md:gap-12">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 pb-4 whitespace-nowrap transition-all duration-700 md:gap-3 md:pb-6 ${
                  isActive ? "text-foreground" : "text-muted-foreground/40 hover:text-muted-foreground/80"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-accent" : "text-current"}`} />
                <span className="small-caps text-[11px] font-bold tracking-[0.2em]">{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full bg-accent text-[8px] font-mono font-bold text-white shadow-sm ring-1 ring-accent/20">
                    {tab.count}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="admin-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.5 }}
            >
              {activeTab === "products" && <ProductTab />}
              {activeTab === "orders" && <OrderTab />}
              {activeTab === "appointments" && <AppointmentTab />}
              {activeTab === "customers" && <CustomerTab />}
              {activeTab === "supportTickets" && <SupportTab />}
              {activeTab === "settings" && <SettingTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default AdminDashboard
