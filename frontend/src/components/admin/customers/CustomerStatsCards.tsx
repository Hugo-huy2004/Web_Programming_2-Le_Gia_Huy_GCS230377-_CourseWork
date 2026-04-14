type CustomerStatsCardsProps = {
  shown: number
  diamond: number
  gold: number
  totalValueText: string
}

export function CustomerStatsCards({ shown, diamond, gold, totalValueText }: CustomerStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      <div className="liquid-glass rounded-sm border border-border p-4 md:p-5 shadow-sm">
        <p className="small-caps text-[9px] text-muted-foreground">Visible Customers</p>
        <p className="mt-2 font-serif text-2xl md:text-3xl italic text-foreground">{shown}</p>
      </div>
      <div className="liquid-glass rounded-sm border border-border p-4 md:p-5 shadow-sm">
        <p className="small-caps text-[9px] text-muted-foreground">Diamond Tier</p>
        <p className="mt-2 font-serif text-2xl md:text-3xl italic text-accent">{diamond}</p>
      </div>
      <div className="liquid-glass rounded-sm border border-border p-4 md:p-5 shadow-sm">
        <p className="small-caps text-[9px] text-muted-foreground">Gold Tier</p>
        <p className="mt-2 font-serif text-2xl md:text-3xl italic text-amber-500">{gold}</p>
      </div>
      <div className="liquid-glass rounded-sm border border-border p-4 md:p-5 shadow-sm col-span-2 md:col-span-1">
        <p className="small-caps text-[9px] text-muted-foreground">Portfolio Value</p>
        <p className="mt-2 font-serif text-xl md:text-2xl italic text-foreground break-words">{totalValueText}</p>
      </div>
    </div>
  )
}
