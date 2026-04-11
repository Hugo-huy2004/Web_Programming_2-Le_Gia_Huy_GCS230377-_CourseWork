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
      <Search className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/30 transition-colors duration-500 group-focus-within:text-accent" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-border/40 bg-transparent py-4 pl-10 font-serif text-2xl italic text-foreground outline-none transition-all duration-700 placeholder:text-muted-foreground/20 focus:border-accent"
      />
    </div>
  )
}
