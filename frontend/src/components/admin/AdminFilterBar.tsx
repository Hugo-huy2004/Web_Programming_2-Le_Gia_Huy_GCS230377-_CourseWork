import { ChevronDown, Search } from "lucide-react"

type FilterOption = {
  value: string
  label: string
}

type AdminFilterBarProps = {
  searchLabel: string
  searchPlaceholder: string
  searchValue: string
  onSearchChange: (value: string) => void
  statusLabel: string
  statusValue: string
  onStatusChange: (value: string) => void
  statusOptions: FilterOption[]
}

export function AdminFilterBar({
  searchLabel,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  statusLabel,
  statusValue,
  onStatusChange,
  statusOptions,
}: AdminFilterBarProps) {
  return (
    <div className="grid gap-4 rounded-sm border border-border bg-background p-4 md:grid-cols-2">
      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          {searchLabel}
        </label>
        <div className="group relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-sm border border-border bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground">
          {statusLabel}
        </label>
        <div className="relative">
          <select
            value={statusValue}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-10 w-full appearance-none rounded-sm border border-border bg-background px-3 pr-8 text-sm text-foreground outline-none transition-colors focus:border-foreground"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}
