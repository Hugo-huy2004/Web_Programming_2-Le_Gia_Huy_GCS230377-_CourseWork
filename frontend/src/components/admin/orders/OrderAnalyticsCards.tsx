type OrderAnalyticsCardsProps = {
  totalRevenueText: string
  pendingCount: number
  totalOrders: number
}

export function OrderAnalyticsCards({ totalRevenueText, pendingCount, totalOrders }: OrderAnalyticsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-8">
      {[
        { label: "Lifetime Portfolio Revenue", value: totalRevenueText, accent: true },
        { label: "Active Pending Acquisitions", value: pendingCount, accent: true },
        { label: "Total Heritage Acquisitions", value: totalOrders, accent: false },
      ].map((stat, idx) => (
        <div key={idx} className="liquid-glass space-y-2 rounded-sm border border-border p-4 shadow-editorial md:space-y-3 md:p-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground md:small-caps md:font-bold md:tracking-[0.2em]">{stat.label}</p>
          <p className={`text-3xl font-semibold tracking-tight md:font-serif md:text-4xl ${stat.accent ? "text-accent md:italic" : "text-foreground"}`}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  )
}
