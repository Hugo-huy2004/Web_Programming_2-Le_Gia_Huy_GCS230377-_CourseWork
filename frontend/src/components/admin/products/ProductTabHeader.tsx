import { Plus } from "lucide-react"

type ProductTabHeaderProps = {
  onAddNew: () => void
}

export function ProductTabHeader({ onAddNew }: ProductTabHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-3 border-b border-border/40 pb-5 md:flex-row md:items-end md:pb-6">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Admin products</p>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Product list</h2>
      </div>
      <button
        onClick={onAddNew}
        aria-label="Register new asset"
        title="Register new asset"
        className="inline-flex h-11 w-11 items-center justify-center rounded-sm bg-foreground text-background shadow-sm transition-all duration-500 hover:bg-accent md:h-auto md:w-auto md:gap-3 md:px-8 md:py-3"
      >
        <Plus className="h-5 w-5 md:h-4 md:w-4" />
        <span className="hidden text-xs font-semibold md:inline">Add product</span>
      </button>
    </div>
  )
}
