type CustomerRegistryStatsProps = {
  shown: number
  diamond: number
  gold: number
  totalValueText: string
}

export function CustomerRegistryStats({ shown, diamond, gold, totalValueText }: CustomerRegistryStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="rounded-sm border border-border bg-white p-5 shadow-sm">
        <p className="small-caps text-[9px] text-muted-foreground">Visible Collectors</p>
        <p className="mt-2 font-serif text-3xl italic text-foreground">{shown}</p>
      </div>
      <div className="rounded-sm border border-border bg-white p-5 shadow-sm">
        <p className="small-caps text-[9px] text-muted-foreground">Diamond Tier</p>
        <p className="mt-2 font-serif text-3xl italic text-accent">{diamond}</p>
      </div>
      <div className="rounded-sm border border-border bg-white p-5 shadow-sm">
        <p className="small-caps text-[9px] text-muted-foreground">Gold Tier</p>
        <p className="mt-2 font-serif text-3xl italic text-amber-500">{gold}</p>
      </div>
      <div className="rounded-sm border border-border bg-white p-5 shadow-sm">
        <p className="small-caps text-[9px] text-muted-foreground">Portfolio Value</p>
        <p className="mt-2 font-serif text-2xl italic text-foreground">{totalValueText}</p>
      </div>
    </div>
  )
}
