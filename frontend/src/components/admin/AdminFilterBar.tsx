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
    <div className="flex flex-col gap-5 rounded-sm border border-border/40 bg-secondary/30 p-4 md:flex-row md:items-end md:gap-8 md:p-10">
      <div className="w-full flex-1 space-y-3 md:space-y-4">
        <label className="small-caps text-[9px] font-bold tracking-[0.2em] text-muted-foreground">
          {searchLabel}
        </label>
        <div className="group relative">
          <Search className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/30 transition-colors duration-500 group-focus-within:text-accent" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full border-b border-border bg-transparent py-2 pl-9 font-serif text-lg italic text-foreground outline-none transition-all duration-700 placeholder:text-muted-foreground/20 focus:border-accent md:py-3 md:pl-10 md:text-xl"
          />
        </div>
      </div>

      <div className="w-full space-y-3 md:w-72 md:space-y-4">
        <label className="small-caps text-[9px] font-bold tracking-[0.2em] text-muted-foreground">
          {statusLabel}
        </label>
        <div className="relative">
          <select
            value={statusValue}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full appearance-none border-b border-border bg-transparent py-3 font-serif text-base italic text-foreground outline-none transition-all duration-700 focus:border-accent md:py-4 md:text-lg"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />
        </div>
      </div>
    </div>
  )
}
