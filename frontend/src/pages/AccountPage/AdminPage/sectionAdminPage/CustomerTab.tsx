import { useState, useEffect, useMemo } from "react"
import { useCustomerStore } from "@/stores/useCustomerStore"
import { useOrderStore } from "@/stores/useOrderStore"
import type { CustomerAccount, Order } from "@/types/store"
import { useAppStore } from "@/stores/useAppStore"
import type { CustomerSortOption, CustomerTierFilter } from "@/constants/customerRegistryOptions"
import {
  calculateCustomerRegistryStats,
  filterAndSortCustomers,
  getCustomerTierBadge,
} from "@/lib/registryUtils"
import { CustomerDossierDrawer } from "@/components/admin/customers/CustomerDossierDrawer"
import { CustomerRegistryTable } from "@/components/admin/customers/CustomerRegistryTable"
import { CustomerRegistryControls } from "@/components/admin/customers/CustomerRegistryControls"
import { CustomerRegistryStats } from "@/components/admin/customers/CustomerRegistryStats"
import { CustomerTabHeader } from "@/components/admin/customers/CustomerTabHeader"
 
const CustomerTab = () => {
  const { customers, fetchAllCustomers, updateCustomerProfileByEmail } = useCustomerStore()
  const { orders, fetchOrders } = useOrderStore()
  const { formatUsd } = useAppStore()

  const [search, setSearch] = useState("")
  const [tierFilter, setTierFilter] = useState<CustomerTierFilter>("all")
  const [sortBy, setSortBy] = useState<CustomerSortOption>("spent")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerAccount | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editForm, setEditForm] = useState({ fullName: "", phone: "", address: "", birthday: "" })
  const [saveStatus, setSaveStatus] = useState("")

  const refreshRegistryData = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([fetchAllCustomers(), fetchOrders("admin", null)])
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    void refreshRegistryData()
  }, [fetchAllCustomers, fetchOrders])

  const filteredCustomers = useMemo(() => {
    return filterAndSortCustomers(customers, search, tierFilter, sortBy)
  }, [customers, search, tierFilter, sortBy])

  const stats = useMemo(() => {
    return calculateCustomerRegistryStats(customers, filteredCustomers)
  }, [customers, filteredCustomers])

  const handleOpenDossier = (customer: CustomerAccount) => {
    setSelectedCustomer(customer)
    setEditForm({
      fullName: customer.profile.fullName || "",
      phone: customer.profile.phone || "",
      address: customer.profile.address || "",
      birthday: customer.profile.birthday || ""
    })
    setSaveStatus("")
    setIsDrawerOpen(true)
  }

  const handleSaveProfile = async () => {
    if (!selectedCustomer) return
    try {
      setSaveStatus("Synchronizing...")
      const result = await updateCustomerProfileByEmail(selectedCustomer.email, editForm)
      if (result.message) {
        setSaveStatus("Registry Updated")
        await refreshRegistryData()
        setTimeout(() => setSaveStatus(""), 3000)
      }
    } catch (err) {
      setSaveStatus("Synchronization Failed")
    }
  }

  const customerOrders = selectedCustomer 
    ? orders.filter((o: Order) => o.customerEmail === selectedCustomer.email) 
    : []

  return (
    <div className="space-y-12 py-6 animate-in fade-in duration-1000">
      <CustomerTabHeader customerCount={customers.length} />

      <CustomerRegistryStats
        shown={stats.visibleCount}
        diamond={stats.diamondCount}
        gold={stats.goldCount}
        totalValueText={formatUsd(stats.totalPortfolioValue)}
      />

      <CustomerRegistryControls
        search={search}
        onSearchChange={setSearch}
        shownCount={filteredCustomers.length}
        totalCount={customers.length}
        tierFilter={tierFilter}
        onTierFilterChange={setTierFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        isRefreshing={isRefreshing}
        onRefresh={() => void refreshRegistryData()}
      />

      <CustomerRegistryTable
        customers={filteredCustomers}
        formatUsd={formatUsd}
        getTierLabel={getCustomerTierBadge}
        onOpenDossier={handleOpenDossier}
      />

      <CustomerDossierDrawer
        isOpen={isDrawerOpen}
        selectedCustomer={selectedCustomer}
        editForm={editForm}
        setEditForm={setEditForm}
        saveStatus={saveStatus}
        customerOrders={customerOrders}
        formatUsd={formatUsd}
        onClose={() => setIsDrawerOpen(false)}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  )
}
 
export default CustomerTab
