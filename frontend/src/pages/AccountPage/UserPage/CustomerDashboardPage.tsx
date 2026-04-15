import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ProfileTab } from "@/pages/AccountPage/UserPage/customerTab/ProfileTab"
import { OrderTab } from "@/pages/AccountPage/UserPage/customerTab/OrderTab"
import { ConciergeTab } from "@/pages/AccountPage/UserPage/customerTab/ConciergeTab"
import { useCustomerStore } from "@/stores/useCustomerStore"

type CustomerTabId = 0 | 1 | 2

const CUSTOMER_TAB_ITEMS: Array<{ id: CustomerTabId; label: string; icon: string; title: string }> = [
  { id: 0, label: "Identity Registry", icon: "ID", title: "Identity Registry" },
  { id: 1, label: "Portfolio Archive", icon: "PA", title: "Investment Portfolio" },
  { id: 2, label: "Private Concierge", icon: "PC", title: "Concierge Liaison" },
]

function getActiveTabTitle(activeTab: CustomerTabId): string {
  return CUSTOMER_TAB_ITEMS.find((item) => item.id === activeTab)?.title ?? "Identity Registry"
}

const CustomerDashboardPage = () => {
  const { customerLogout } = useCustomerStore()

  const [activeTab, setActiveTab] = useState<CustomerTabId>(0)

  const pageTitle = getActiveTabTitle(activeTab)

  const renderActiveSection = () => {
    if (activeTab === 0) return <ProfileTab />
    if (activeTab === 1) return <OrderTab />
    return <ConciergeTab />
  }

  return (
    <div className="animate-in fade-in duration-700 flex flex-col gap-4 md:gap-6 lg:flex-row lg:gap-14 lg:min-h-[600px]">
      <aside className="w-full shrink-0 lg:w-64">
        <nav className="no-scrollbar flex gap-1.5 overflow-x-auto rounded-sm border border-border/40 bg-background/90 p-1.5 backdrop-blur-sm md:p-2 lg:flex-col lg:gap-2 lg:overflow-visible lg:border-none lg:bg-transparent lg:p-0 lg:backdrop-blur-0">
          {CUSTOMER_TAB_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-sm border px-3 py-2 text-[10px] font-semibold transition-all duration-300 md:px-3 md:py-2 md:text-[8px] md:font-bold md:uppercase md:tracking-[0.12em] lg:w-full ${
                activeTab === item.id
                  ? "bg-foreground text-background border-foreground shadow-sm"
                  : "border-transparent text-muted-foreground/80 hover:border-border/50 hover:bg-background/50 hover:text-foreground"
              }`}
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current/20 text-[9px] font-semibold opacity-80 md:h-auto md:w-auto md:border-0 md:text-[9px] md:font-serif md:italic md:tracking-normal md:normal-case md:opacity-50">
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}

          <div className="hidden lg:block h-px w-10 bg-border/40 my-4" />

          <button
            onClick={customerLogout}
            className="hidden lg:flex items-center gap-4 px-6 py-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.25em] text-destructive/40 hover:text-destructive transition-all duration-500 hover:bg-destructive/5"
          >
            <span className="font-serif italic text-xs tracking-normal normal-case opacity-40">LO</span>
            Logout
          </button>

          <button
            onClick={customerLogout}
            className="ml-auto rounded-sm border border-destructive/30 px-3 py-2 text-[10px] font-semibold text-destructive md:hidden"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="mb-4 md:mb-8 lg:mb-14">
              <h1 className="text-xl font-semibold text-foreground tracking-tight md:font-serif md:text-5xl md:tracking-tighter md:italic">
                {pageTitle}
              </h1>
              <div className="mt-2 h-px w-16 bg-accent/30 md:mt-4 md:w-24" />
            </header>

            {renderActiveSection()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default CustomerDashboardPage
