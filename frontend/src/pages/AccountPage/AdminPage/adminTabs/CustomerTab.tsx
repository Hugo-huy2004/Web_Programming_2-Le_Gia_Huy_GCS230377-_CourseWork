import { useState, useEffect, useMemo } from "react"
import { useCustomerStore } from "@/stores/useCustomerStore"
import { useOrderStore } from "@/stores/useOrderStore"
import type { CustomerAccount, Order } from "@/types/store"
import { useAppStore } from "@/stores/useAppStore"
import type { CustomerSortOption, CustomerTierFilter } from "@/constants/customerRegistryOptions"
import {
  calculateCustomerListStats,
  filterAndSortCustomers,
  getCustomerTierBadge,
} from "@/lib/registryUtils"
import { CustomerDetailsDrawer } from "@/components/admin/customers/CustomerDetailsDrawer"
import { CustomerListTable } from "@/components/admin/customers/CustomerListTable"
import { CustomerFiltersPanel } from "@/components/admin/customers/CustomerFiltersPanel"
import { CustomerStatsCards } from "@/components/admin/customers/CustomerStatsCards"
import { CustomerTabHeader } from "@/components/admin/customers/CustomerTabHeader"
import { toast } from "sonner"
 
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

  const refreshCustomerData = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([fetchAllCustomers(), fetchOrders("admin", null)])
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    void refreshCustomerData()
  }, [fetchAllCustomers, fetchOrders])

  const filteredCustomers = useMemo(() => {
    return filterAndSortCustomers(customers, search, tierFilter, sortBy)
  }, [customers, search, tierFilter, sortBy])

  const stats = useMemo(() => {
    return calculateCustomerListStats(customers, filteredCustomers)
  }, [customers, filteredCustomers])

  const handleOpenCustomerDetails = (customer: CustomerAccount) => {
    setSelectedCustomer(customer)
    setEditForm({
      fullName: customer.profile.fullName || "",
      phone: customer.profile.phone || "",
      address: customer.profile.address || "",
      birthday: customer.profile.birthday || ""
    })
    setIsDrawerOpen(true)
  }

  const handleSaveProfile = async () => {
    if (!selectedCustomer) return
    try {
      const result = await updateCustomerProfileByEmail(selectedCustomer.email, editForm)
      if (result.ok) {
        toast.success("Customer profile updated.")
        await refreshCustomerData()
        return
      }

      toast.error(result.message || "Failed to update customer profile.")
    } catch (err) {
      toast.error("Failed to update customer profile.")
    }
  }

  const customerOrders = selectedCustomer 
    ? orders.filter((o: Order) => o.customerEmail === selectedCustomer.email) 
    : []

  return (
    <div className="animate-in fade-in duration-700 space-y-4 py-3 md:space-y-12 md:py-6 md:duration-1000">
      <CustomerTabHeader customerCount={customers.length} />

      <CustomerStatsCards
        shown={stats.visibleCount}
        diamond={stats.diamondCount}
        gold={stats.goldCount}
        totalValueText={formatUsd(stats.totalPortfolioValue)}
      />

      <CustomerFiltersPanel
        search={search}
        onSearchChange={setSearch}
        shownCount={filteredCustomers.length}
        totalCount={customers.length}
        tierFilter={tierFilter}
        onTierFilterChange={setTierFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        isRefreshing={isRefreshing}
        onRefresh={() => void refreshCustomerData()}
      />

      <CustomerListTable
        customers={filteredCustomers}
        formatUsd={formatUsd}
        getTierLabel={getCustomerTierBadge}
        onOpenCustomerDetails={handleOpenCustomerDetails}
      />

      <CustomerDetailsDrawer
        isOpen={isDrawerOpen}
        selectedCustomer={selectedCustomer}
        editForm={editForm}
        setEditForm={setEditForm}
        customerOrders={customerOrders}
        formatUsd={formatUsd}
        onClose={() => setIsDrawerOpen(false)}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  )
}
 
export default CustomerTab
