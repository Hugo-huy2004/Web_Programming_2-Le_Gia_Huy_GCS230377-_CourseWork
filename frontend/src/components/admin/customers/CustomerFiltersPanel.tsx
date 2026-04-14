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
    <div className="liquid-glass flex flex-col gap-5 rounded-sm border border-border/40 p-4 md:p-6 shadow-sm md:flex-row md:items-end md:justify-between">
      <div className="w-full space-y-4 md:max-w-2xl">
        <AdminSearchInput
          className="max-w-none"
          placeholder="Locate customers by email or full name..."
          value={search}
          onChange={onSearchChange}
        />
        <p className="small-caps text-[9px] text-muted-foreground/60">
          Showing {shownCount} of {totalCount} customers
        </p>
      </div>

      <div className="flex flex-wrap items-stretch gap-2 md:gap-3">
        {CUSTOMER_TIER_FILTER_OPTIONS.map((item) => (
          <button
            key={item.key}
            onClick={() => onTierFilterChange(item.key)}
            className={`rounded-sm border px-3 md:px-4 py-2 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.12em] md:tracking-[0.15em] transition-all ${tierFilter === item.key ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            {item.label}
          </button>
        ))}

        <select
          value={sortBy}
          onChange={(event) => onSortByChange(event.target.value as CustomerSortOption)}
          className="w-full sm:w-auto rounded-sm border border-border bg-transparent px-3 py-2 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.12em] md:tracking-[0.15em] outline-none focus:border-accent"
        >
          {CUSTOMER_SORT_OPTIONS.map((item) => (
            <option key={item.key} value={item.key}>{item.label}</option>
          ))}
        </select>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-sm border border-border px-4 py-2 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.12em] md:tracking-[0.15em] text-foreground transition-all hover:border-accent hover:text-accent disabled:opacity-40"
        >
          <RefreshCcw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Syncing" : "Refresh"}
        </button>
      </div>
    </div>
  )
}
