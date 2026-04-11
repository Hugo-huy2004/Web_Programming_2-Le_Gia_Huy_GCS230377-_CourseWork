type OrderAnalyticsCardsProps = {
  totalRevenueText: string
  pendingCount: number
  totalOrders: number
}

export function OrderAnalyticsCards({ totalRevenueText, pendingCount, totalOrders }: OrderAnalyticsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {[
        { label: "Lifetime Portfolio Revenue", value: totalRevenueText, accent: true },
        { label: "Active Pending Acquisitions", value: pendingCount, accent: true },
        { label: "Total Heritage Acquisitions", value: totalOrders, accent: false },
      ].map((stat, idx) => (
        <div key={idx} className="space-y-3 border border-border bg-white p-8 shadow-editorial">
          <p className="small-caps text-[10px] font-bold tracking-[0.2em] text-muted-foreground">{stat.label}</p>
          <p className={`font-serif text-3xl tracking-tight md:text-4xl ${stat.accent ? "text-accent italic" : "text-foreground"}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  )
}
