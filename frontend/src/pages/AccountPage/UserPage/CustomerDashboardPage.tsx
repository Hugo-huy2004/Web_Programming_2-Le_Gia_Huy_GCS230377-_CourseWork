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
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-14 min-h-[600px] animate-in fade-in duration-700">
      <aside className="w-full lg:w-64 shrink-0">
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible no-scrollbar p-1 bg-secondary/25 rounded-sm border border-border/30 lg:border-none lg:bg-transparent lg:p-0 gap-1 lg:gap-2">
          {CUSTOMER_TAB_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-2.5 py-2 rounded-sm text-[7px] font-bold uppercase tracking-[0.1em] transition-all duration-500 whitespace-nowrap lg:w-full border md:px-3 md:py-2 md:text-[8px] md:tracking-[0.12em] ${
                activeTab === item.id
                  ? "bg-foreground text-background border-foreground shadow-sm"
                  : "text-muted-foreground/60 hover:text-accent border-transparent hover:border-border/50 hover:bg-background/50"
              }`}
            >
              <span className="font-serif italic text-[9px] tracking-normal normal-case opacity-50">{item.icon}</span>
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
            <header className="mb-8 lg:mb-14">
              <h1 className="font-serif text-2xl md:text-5xl text-foreground tracking-tighter italic">
                {pageTitle}
              </h1>
              <div className="h-px w-24 bg-accent/30 mt-4" />
            </header>

            {renderActiveSection()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default CustomerDashboardPage
