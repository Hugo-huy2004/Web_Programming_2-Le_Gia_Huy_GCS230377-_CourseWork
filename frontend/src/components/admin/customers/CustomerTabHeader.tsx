type CustomerTabHeaderProps = {
  customerCount: number
}

export function CustomerTabHeader({ customerCount }: CustomerTabHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 md:gap-6 border-b border-border/40 pb-6 md:pb-8 md:flex-row md:items-end">
      <div className="space-y-2">
        <p className="small-caps text-[10px] font-medium tracking-[0.2em] text-accent">Customer Relationship Registry</p>
        <h2 className="font-serif text-2xl md:text-4xl italic tracking-tight text-foreground">Collector Directory</h2>
      </div>
      <p className="font-serif text-[13px] md:text-[15px] italic text-muted-foreground/60">
        Overseeing {customerCount} Authorized Entities
      </p>
    </div>
  )
}
