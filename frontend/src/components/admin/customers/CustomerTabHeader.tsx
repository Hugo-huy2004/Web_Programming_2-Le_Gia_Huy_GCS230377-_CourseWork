type CustomerTabHeaderProps = {
  customerCount: number
}

export function CustomerTabHeader({ customerCount }: CustomerTabHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-2 border-b border-border/40 pb-4 md:gap-6 md:pb-8 md:flex-row md:items-end">
      <div className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-accent md:small-caps md:font-medium md:tracking-[0.2em]">Customer Relationship Registry</p>
        <h2 className="text-xl font-semibold tracking-tight text-foreground md:font-serif md:text-4xl md:italic">Collector Directory</h2>
      </div>
      <p className="text-[11px] text-muted-foreground/70 md:font-serif md:text-[15px] md:italic md:text-muted-foreground/60">
        Overseeing {customerCount} Authorized Entities
      </p>
    </div>
  )
}
