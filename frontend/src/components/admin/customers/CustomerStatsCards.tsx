type CustomerStatsCardsProps = {
  shown: number
  diamond: number
  gold: number
  totalValueText: string
}

export function CustomerStatsCards({ shown, diamond, gold, totalValueText }: CustomerStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
      <div className="liquid-glass rounded-sm border border-border p-3 shadow-sm md:p-5">
        <p className="text-[10px] font-medium text-muted-foreground md:small-caps md:text-[9px]">Visible Customers</p>
        <p className="mt-1 text-xl font-semibold text-foreground md:mt-2 md:font-serif md:text-3xl md:italic">{shown}</p>
      </div>
      <div className="liquid-glass rounded-sm border border-border p-3 shadow-sm md:p-5">
        <p className="text-[10px] font-medium text-muted-foreground md:small-caps md:text-[9px]">Diamond Tier</p>
        <p className="mt-1 text-xl font-semibold text-accent md:mt-2 md:font-serif md:text-3xl md:italic">{diamond}</p>
      </div>
      <div className="liquid-glass rounded-sm border border-border p-3 shadow-sm md:p-5">
        <p className="text-[10px] font-medium text-muted-foreground md:small-caps md:text-[9px]">Gold Tier</p>
        <p className="mt-1 text-xl font-semibold text-amber-500 md:mt-2 md:font-serif md:text-3xl md:italic">{gold}</p>
      </div>
      <div className="liquid-glass col-span-2 rounded-sm border border-border p-3 shadow-sm md:col-span-1 md:p-5">
        <p className="text-[10px] font-medium text-muted-foreground md:small-caps md:text-[9px]">Portfolio Value</p>
        <p className="mt-1 break-words text-base font-semibold text-foreground md:mt-2 md:font-serif md:text-2xl md:italic">{totalValueText}</p>
      </div>
    </div>
  )
}
