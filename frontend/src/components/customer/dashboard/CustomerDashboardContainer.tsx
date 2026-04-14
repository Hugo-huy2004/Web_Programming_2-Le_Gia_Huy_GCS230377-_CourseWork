import { motion, AnimatePresence } from "framer-motion"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { CustomerProfileTab } from "@/components/customer/tabs/CustomerProfileTab"
import { CustomerOrderTab } from "@/components/customer/tabs/CustomerOrderTab"
import { CustomerConciergeTab } from "@/components/customer/tabs/CustomerConciergeTab"
import { useCustomerStore } from "@/stores/useCustomerStore"
import { useOrderStore } from "@/stores/useOrderStore"
import { useProductStore } from "@/stores/useProductStore"
import { useAppStore } from "@/stores/useAppStore"
import type { Order, ProfileForm } from "@/types/store"
import { formatUsd } from "@/lib/formatUtils"
import { generateInvoice } from "@/lib/invoiceUtils"

type CustomerTabId = 0 | 1 | 2

const CUSTOMER_TAB_ITEMS: Array<{ id: CustomerTabId; label: string; icon: string; title: string }> = [
  { id: 0, label: "Identity Registry", icon: "ID", title: "Identity Registry" },
  { id: 1, label: "Portfolio Archive", icon: "PA", title: "Investment Portfolio" },
  { id: 2, label: "Private Concierge", icon: "PC", title: "Concierge Liaison" },
]

function validateProfileForm(profile: ProfileForm): Partial<ProfileForm> {
  const errors: Partial<ProfileForm> = {}

  if (!profile.fullName.trim()) errors.fullName = "Full name is required."
  if (!profile.birthday) errors.birthday = "Birthday is required."
  if (!profile.phone.trim()) errors.phone = "Phone number is required."
  if (!profile.address.trim()) errors.address = "Address is required."

  return errors
}

function getActiveTabTitle(activeTab: CustomerTabId): string {
  return CUSTOMER_TAB_ITEMS.find((item) => item.id === activeTab)?.title ?? "Identity Registry"
}

export function CustomerDashboardContainer() {
  const { activeCustomerEmail, activeCustomer, customers, updateCustomerProfile, customerLogout } = useCustomerStore()
  const { orders, seenStatuses, markOrderAsSeen } = useOrderStore()
  const { products } = useProductStore()
  const { addSupportTicket } = useAppStore()

  const [activeTab, setActiveTab] = useState<CustomerTabId>(0)
  const [supportRequestMessage, setSupportRequestMessage] = useState("")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editProfileForm, setEditProfileForm] = useState<ProfileForm>({
    fullName: "",
    birthday: "",
    phone: "",
    address: "",
  })
  const [, setEditProfileErrors] = useState<Partial<ProfileForm>>({})

  const resolvedActiveCustomer = useMemo(() => {
    if (activeCustomer) return activeCustomer
    if (!activeCustomerEmail) return null
    return customers.find((customer) => customer.email === activeCustomerEmail) ?? null
  }, [activeCustomer, activeCustomerEmail, customers])

  const memberOrders = useMemo(() => {
    if (!activeCustomerEmail) return []
    return orders.filter((order) => order.customerEmail === activeCustomerEmail)
  }, [orders, activeCustomerEmail])

  const pageTitle = getActiveTabTitle(activeTab)

  const beginProfileEdit = () => {
    if (!resolvedActiveCustomer) return

    setEditProfileForm({
      fullName: resolvedActiveCustomer.profile.fullName,
      birthday: resolvedActiveCustomer.profile.birthday,
      phone: resolvedActiveCustomer.profile.phone,
      address: resolvedActiveCustomer.profile.address,
    })
    setEditProfileErrors({})
    setIsEditingProfile(true)
  }

  const submitProfileUpdate = async () => {
    const errors = validateProfileForm(editProfileForm)

    if (Object.keys(errors).length > 0) {
      setEditProfileErrors(errors)
      toast.error("Please refine your registry details.")
      return
    }

    const result = await updateCustomerProfile({
      fullName: editProfileForm.fullName,
      birthday: editProfileForm.birthday,
      phone: editProfileForm.phone,
      address: editProfileForm.address,
    })

    if (result.ok) {
      setIsEditingProfile(false)
      setEditProfileErrors({})
      toast.success("Identity Registry Refined Successfully")
      return
    }

    toast.error(result.message)
  }

  const exportOrderInvoice = (order: Order) => {
    generateInvoice(order, formatUsd, products)
  }

  const submitInquiry = async () => {
    if (!activeCustomerEmail) {
      toast.error("Identity verification required.")
      return
    }
    if (!supportRequestMessage.trim()) {
      toast.error("Please provide inquiry details.")
      return
    }

    const result = await addSupportTicket(activeCustomerEmail, supportRequestMessage)
    if (result.ok) {
      setSupportRequestMessage("")
      toast.success("Inquiry dispatched to support database.")
      return
    }

    toast.error(result.message || "Failed to dispatch inquiry.")
  }

  const renderActiveSection = () => {
    if (activeTab === 0) {
      return (
        <CustomerProfileTab
          activeCustomer={resolvedActiveCustomer}
          isEditingProfile={isEditingProfile}
          setIsEditingProfile={setIsEditingProfile}
          editProfileForm={editProfileForm}
          setEditProfileForm={setEditProfileForm}
          setEditProfileErrors={setEditProfileErrors}
          handleStartEditProfile={beginProfileEdit}
          handleSaveEditedProfile={submitProfileUpdate}
          customerLogout={customerLogout}
          formatUsd={formatUsd}
        />
      )
    }

    if (activeTab === 1) {
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

    return (
      <CustomerConciergeTab
        message={supportRequestMessage}
        onMessageChange={setSupportRequestMessage}
        onSubmitInquiry={submitInquiry}
      />
    )
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
