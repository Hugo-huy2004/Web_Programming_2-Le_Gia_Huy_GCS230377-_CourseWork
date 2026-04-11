import { motion, AnimatePresence } from "framer-motion"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { ProfileSection } from "@/pages/AccountPage/UserPage/sectionUserPage/ProfileSection"
import { OrderSection } from "@/pages/AccountPage/UserPage/sectionUserPage/OrderSection"
import { ConciergeSection } from "@/pages/AccountPage/UserPage/sectionUserPage/ConciergeSection"
import { useCustomerStore } from "@/stores/useCustomerStore"
import { useOrderStore } from "@/stores/useOrderStore"
import { useAppStore } from "@/stores/useAppStore"
import type { ProfileForm } from "@/types/store"
import { formatUsd } from "@/lib/formatUtils"

function validateProfileForm(profile: ProfileForm): Partial<ProfileForm> {
  const errors: Partial<ProfileForm> = {}

  if (!profile.fullName.trim()) errors.fullName = "Full name is required."
  if (!profile.birthday) errors.birthday = "Birthday is required."
  if (!profile.phone.trim()) errors.phone = "Phone number is required."
  if (!profile.address.trim()) errors.address = "Address is required."

  return errors
}

function getUserPageTitle(activeTab: number): string {
  if (activeTab === 0) return "Identity Registry"
  if (activeTab === 1) return "Investment Portfolio"
  return "Concierge Liaison"
}
 
const UserPage = () => {
  const { activeCustomerEmail, activeCustomer, customers, updateCustomerProfile, customerLogout } = useCustomerStore()
  const { orders } = useOrderStore()
  const { addSupportTicket } = useAppStore()

  const [activeTab, setActiveTab] = useState(0)
  const [supportMessage, setSupportMessage] = useState("")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editProfileForm, setEditProfileForm] = useState<ProfileForm>({
    fullName: "",
    birthday: "",
    phone: "",
    address: "",
  })
  const [editProfileErrors, setEditProfileErrors] = useState<Partial<ProfileForm>>({})

  const resolvedActiveCustomer = useMemo(() => {
    if (activeCustomer) return activeCustomer
    if (!activeCustomerEmail) return null
    return customers.find((customer) => customer.email === activeCustomerEmail) ?? null
  }, [activeCustomer, activeCustomerEmail, customers])

  const memberOrders = useMemo(() => {
    if (!activeCustomerEmail) return []
    return orders.filter((order) => order.customerEmail === activeCustomerEmail)
  }, [orders, activeCustomerEmail])

  const pageTitle = getUserPageTitle(activeTab)

  const startProfileEdit = () => {
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

  const saveProfileEdit = async () => {
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
 
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 min-h-[600px] animate-in fade-in duration-700">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 shrink-0">
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible no-scrollbar p-1 bg-secondary/50 rounded-sm border border-border lg:border-none lg:bg-transparent lg:p-0 gap-2 lg:gap-4">
          {[
            { id: 0, label: "Identity Registry", icon: "ID" },
            { id: 1, label: "Portfolio Archive", icon: "PA" },
            { id: 2, label: "Private Concierge", icon: "PC" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-4 px-6 py-4 rounded-sm text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-500 whitespace-nowrap lg:w-full border ${
                activeTab === item.id 
                  ? "bg-foreground text-background border-foreground shadow-lg scale-[1.02]" 
                  : "text-muted-foreground/40 hover:text-accent border-transparent hover:border-border"
              }`}
            >
              <span className="font-serif italic text-xs tracking-normal normal-case opacity-40">{item.icon}</span>
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
 
      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="mb-10 lg:mb-14">
              <h1 className="font-serif text-3xl md:text-5xl text-foreground tracking-tighter italic">
                {pageTitle}
              </h1>
              <div className="h-px w-24 bg-accent/30 mt-4" />
            </header>
 
            {activeTab === 0 && (
              <ProfileSection
                activeCustomer={resolvedActiveCustomer}
                isEditingProfile={isEditingProfile}
                setIsEditingProfile={setIsEditingProfile}
                editProfileForm={editProfileForm}
                setEditProfileForm={setEditProfileForm}
                editProfileErrors={editProfileErrors}
                setEditProfileErrors={setEditProfileErrors}
                handleStartEditProfile={startProfileEdit}
                handleSaveEditedProfile={saveProfileEdit}
                customerLogout={customerLogout}
                formatUsd={formatUsd}
              />
            )}
 
            {activeTab === 1 && (
              <OrderSection
                memberOrders={memberOrders}
                formatUsd={formatUsd}
                setStatusMessage={(msg: string) => toast.info(msg)}
              />
            )}
 
            {activeTab === 2 && (
              <ConciergeSection
                supportMessage={supportMessage}
                setSupportMessage={setSupportMessage}
                addSupportTicket={addSupportTicket}
                activeCustomerEmail={activeCustomerEmail}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
 
export default UserPage
