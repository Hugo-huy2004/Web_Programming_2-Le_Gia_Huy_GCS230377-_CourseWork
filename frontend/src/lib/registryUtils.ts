import type { CustomerSortOption, CustomerTierFilter } from "@/constants/customerRegistryOptions"
import { includesKeyword, matchesStatusFilter, normalizeKeyword } from "@/lib/filterUtils"
import type { Product } from "@/types/product"
import type { CustomerAccount, Order, SupportStatus, SupportTicket } from "@/types/store"

export type CustomerRegistryStats = {
  totalPortfolioValue: number
  diamondCount: number
  goldCount: number
  visibleCount: number
}

export type OrderRegistryStats = {
  totalRevenue: number
  pendingCount: number
  totalOrders: number
}

export function getCustomerTier(totalSpent: number): Exclude<CustomerTierFilter, "all"> {
  if (totalSpent >= 20000) return "diamond"
  if (totalSpent >= 5000) return "gold"
  return "silver"
}

export function getCustomerTierBadge(totalSpent: number): { label: string; color: string } {
  const tier = getCustomerTier(totalSpent)
  if (tier === "diamond") return { label: "Diamond VIP", color: "text-accent border-accent bg-accent/5" }
  if (tier === "gold") return { label: "Gold VIP", color: "text-amber-500 border-amber-500/30 bg-amber-500/5" }
  return { label: "Silver", color: "text-muted-foreground/60 border-border/40 bg-secondary/30" }
}

export function filterAndSortCustomers(
  customers: CustomerAccount[],
  searchText: string,
  tierFilter: CustomerTierFilter,
  sortBy: CustomerSortOption
): CustomerAccount[] {
  const keyword = searchText.toLowerCase().trim()

  const filtered = customers.filter((customer) => {
    const matchesKeyword =
      customer.email.toLowerCase().includes(keyword) ||
      (customer.profile.fullName || "").toLowerCase().includes(keyword)

    const matchesTier = tierFilter === "all" || getCustomerTier(customer.totalSpent) === tierFilter
    return matchesKeyword && matchesTier
  })

  if (sortBy === "orders") {
    return filtered.sort((a, b) => b.totalOrders - a.totalOrders)
  }

  if (sortBy === "points") {
    return filtered.sort((a, b) => b.loyaltyPoints - a.loyaltyPoints)
  }

  return filtered.sort((a, b) => b.totalSpent - a.totalSpent)
}

export function calculateCustomerRegistryStats(
  customers: CustomerAccount[],
  visibleCustomers: CustomerAccount[]
): CustomerRegistryStats {
  const totalPortfolioValue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0)
  const diamondCount = customers.filter((customer) => customer.totalSpent >= 20000).length
  const goldCount = customers.filter(
    (customer) => customer.totalSpent >= 5000 && customer.totalSpent < 20000
  ).length

  return {
    totalPortfolioValue,
    diamondCount,
    goldCount,
    visibleCount: visibleCustomers.length,
  }
}

export function calculateOrderRegistryStats(orders: Order[]): OrderRegistryStats {
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.status !== "cancelled" ? order.total : 0),
    0
  )
  const pendingCount = orders.filter((order) => order.status === "pending").length

  return {
    totalRevenue,
    pendingCount,
    totalOrders: orders.length,
  }
}

export function filterOrdersForRegistry(
  orders: Order[],
  products: Product[],
  searchText: string,
  statusFilter: "all" | Order["status"]
): Order[] {
  const keyword = normalizeKeyword(searchText)

  return orders.filter((order) => {
    const matchesKeyword =
      includesKeyword(order.orderCode, keyword) ||
      includesKeyword(order.customerEmail, keyword) ||
      includesKeyword(order.receiverName, keyword) ||
      order.items?.some((item) => {
        const product = products.find((p) => p.id === item.productId)
        const codeMatch = includesKeyword(product?.productCode || item.productCode, keyword)
        const nameMatch = includesKeyword(product?.name || item.name, keyword)
        return codeMatch || nameMatch
      })

    const matchesStatus = matchesStatusFilter(order.status, statusFilter)
    return matchesKeyword && matchesStatus
  })
}

export function filterSupportTickets(
  tickets: SupportTicket[],
  keywordRaw: string,
  statusFilter: "all" | SupportStatus
): SupportTicket[] {
  const keyword = normalizeKeyword(keywordRaw)

  return tickets.filter((ticket) => {
    const matchesKeyword =
      includesKeyword(ticket.customerEmail, keyword) || includesKeyword(ticket.message, keyword)

    const matchesStatus = matchesStatusFilter(ticket.status, statusFilter)
    return matchesKeyword && matchesStatus
  })
}
