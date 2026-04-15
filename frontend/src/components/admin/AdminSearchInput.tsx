import { Search } from "lucide-react"

type AdminSearchInputProps = {
  placeholder: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function AdminSearchInput({ placeholder, value, onChange, className }: AdminSearchInputProps) {
  return (
    <div className={`group relative ${className ?? "max-w-2xl"}`}>
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40 transition-colors duration-300 group-focus-within:text-accent md:left-0 md:h-5 md:w-5 md:duration-500" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full border-b border-border/40 bg-transparent pl-8 text-sm font-medium text-foreground outline-none transition-all duration-300 placeholder:text-muted-foreground/40 focus:border-accent md:h-auto md:py-4 md:pl-10 md:text-2xl md:font-serif md:italic md:duration-700 md:placeholder:text-muted-foreground/20"
      />
    </div>
  )
}
