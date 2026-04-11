export type CustomerTierFilter = "all" | "diamond" | "gold" | "silver"
export type CustomerSortOption = "spent" | "orders" | "points"

export const CUSTOMER_TIER_FILTER_OPTIONS: ReadonlyArray<{ key: CustomerTierFilter; label: string }> = [
  { key: "all", label: "All" },
  { key: "diamond", label: "Diamond" },
  { key: "gold", label: "Gold" },
  { key: "silver", label: "Silver" },
]

export const CUSTOMER_SORT_OPTIONS: ReadonlyArray<{ key: CustomerSortOption; label: string }> = [
  { key: "spent", label: "Sort: Value" },
  { key: "orders", label: "Sort: Orders" },
  { key: "points", label: "Sort: Points" },
]
