import { RefreshCcw } from "lucide-react"
import { AdminSearchInput } from "@/components/admin/AdminSearchInput"
import {
  CUSTOMER_SORT_OPTIONS,
  CUSTOMER_TIER_FILTER_OPTIONS,
  type CustomerSortOption,
  type CustomerTierFilter,
} from "@/constants/customerRegistryOptions"

type CustomerFiltersPanelProps = {
  search: string
  onSearchChange: (value: string) => void
  shownCount: number
  totalCount: number
  tierFilter: CustomerTierFilter
  onTierFilterChange: (value: CustomerTierFilter) => void
  sortBy: CustomerSortOption
  onSortByChange: (value: CustomerSortOption) => void
  isRefreshing: boolean
  onRefresh: () => void
}

export function CustomerFiltersPanel({
  search,
  onSearchChange,
  shownCount,
  totalCount,
  tierFilter,
  onTierFilterChange,
  sortBy,
  onSortByChange,
  isRefreshing,
  onRefresh,
}: CustomerFiltersPanelProps) {
  return (
    <div className="liquid-glass flex flex-col gap-2 rounded-sm border border-border/40 p-2.5 shadow-sm md:flex-row md:items-end md:justify-between md:gap-5 md:p-6">
      <div className="w-full space-y-1.5 md:space-y-4 md:max-w-2xl">
        <AdminSearchInput
          className="max-w-none"
          placeholder="Locate customers by email or full name..."
          value={search}
          onChange={onSearchChange}
        />
        <p className="text-[9px] font-medium text-muted-foreground/65 md:small-caps md:text-[9px] md:text-muted-foreground/60">
          Showing {shownCount} of {totalCount} customers
        </p>
      </div>

      <div className="flex flex-wrap items-stretch gap-1 md:gap-3">
        {CUSTOMER_TIER_FILTER_OPTIONS.map((item) => (
          <button
            key={item.key}
            onClick={() => onTierFilterChange(item.key)}
            className={`rounded-sm border px-2 py-1.5 text-[9px] font-semibold uppercase tracking-[0.06em] leading-none transition-all md:px-4 md:py-2 md:text-[10px] md:font-bold md:tracking-[0.15em] ${tierFilter === item.key ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            {item.label}
          </button>
        ))}

        <select
          value={sortBy}
          onChange={(event) => onSortByChange(event.target.value as CustomerSortOption)}
          className="h-8 w-full rounded-sm border border-border bg-transparent px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.06em] outline-none focus:border-accent sm:w-auto md:h-auto md:px-3 md:py-2 md:text-[10px] md:font-bold md:tracking-[0.15em]"
        >
          {CUSTOMER_SORT_OPTIONS.map((item) => (
            <option key={item.key} value={item.key}>{item.label}</option>
          ))}
        </select>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-sm border border-border px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.06em] text-foreground transition-all hover:border-accent hover:text-accent disabled:opacity-40 sm:h-auto sm:w-auto md:gap-2 md:px-4 md:py-2 md:text-[10px] md:font-bold md:tracking-[0.15em]"
        >
          <RefreshCcw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Syncing" : "Refresh"}
        </button>
      </div>
    </div>
  )
}
