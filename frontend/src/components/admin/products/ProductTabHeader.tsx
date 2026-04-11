import { Plus } from "lucide-react"

type ProductTabHeaderProps = {
  onAddNew: () => void
}

export function ProductTabHeader({ onAddNew }: ProductTabHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-6 border-b border-border/40 pb-8 md:flex-row md:items-end">
      <div className="space-y-2">
        <p className="small-caps text-[10px] tracking-[0.2em] text-accent">Institutional Asset Portfolio</p>
        <h2 className="font-serif text-4xl italic tracking-tight text-foreground">Heritage Archive</h2>
      </div>
      <button
        onClick={onAddNew}
        className="flex items-center gap-3 rounded-sm bg-foreground px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-background shadow-editorial transition-all duration-700 hover:bg-accent"
      >
        <Plus className="h-4 w-4" />
        Register New Asset
      </button>
    </div>
  )
}
