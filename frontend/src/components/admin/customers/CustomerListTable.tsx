import { AnimatePresence, motion } from "framer-motion"
import type { CustomerAccount } from "@/types/store"

type TierInfo = {
  label: string
  color: string
}

type CustomerListTableProps = {
  customers: CustomerAccount[]
  formatUsd: (value: number) => string
  getTierLabel: (spent: number) => TierInfo
  onOpenCustomerDetails: (customer: CustomerAccount) => void
}

export function CustomerListTable({ customers, formatUsd, getTierLabel, onOpenCustomerDetails }: CustomerListTableProps) {
  return (
    <div className="liquid-glass overflow-hidden rounded-sm border border-border/40 shadow-editorial">
      <div className="space-y-3 p-3 md:hidden">
        {customers.map((customer) => {
          const tier = getTierLabel(customer.totalSpent)
          return (
            <button
              key={customer.email}
              onClick={() => onOpenCustomerDetails(customer)}
              className="w-full rounded-sm border border-border/30 bg-background/70 p-4 text-left transition-all hover:border-accent"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-serif text-base italic text-foreground truncate">{customer.profile.fullName || "-"}</p>
                  <p className="mt-1 text-[11px] lowercase text-muted-foreground/60 break-all">{customer.email}</p>
                </div>
                <span className={`inline-block rounded-none border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] ${tier.color}`}>
                  {tier.label}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
                <div>
                  <p className="small-caps text-muted-foreground/60">Orders</p>
                  <p className="font-mono text-foreground/70">{customer.totalOrders}</p>
                </div>
                <div>
                  <p className="small-caps text-muted-foreground/60">Points</p>
                  <p className="font-mono text-accent">{customer.loyaltyPoints}</p>
                </div>
                <div>
                  <p className="small-caps text-muted-foreground/60">Value</p>
                  <p className="font-serif italic text-foreground">{formatUsd(customer.totalSpent)}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="hidden md:block overflow-x-auto">
      <table className="min-w-[760px] w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border/40 bg-secondary/30">
            <th className="small-caps p-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground">Full Name / Email</th>
            <th className="small-caps p-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground">Tier</th>
            <th className="small-caps p-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground">Orders</th>
            <th className="small-caps p-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground">Points</th>
            <th className="small-caps p-6 text-right text-[10px] font-bold tracking-[0.2em] text-muted-foreground">Portfolio Value</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="popLayout">
            {customers.map((customer) => {
              const tier = getTierLabel(customer.totalSpent)
              return (
                <motion.tr
                  layout
                  key={customer.email}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => onOpenCustomerDetails(customer)}
                  className="group cursor-pointer border-b border-border/20 transition-all duration-500 last:border-0 hover:bg-muted/30"
                >
                  <td className="p-6">
                    <p className="font-serif text-[17px] text-foreground transition-colors group-hover:text-accent">
                      {customer.profile.fullName || "-"}
                    </p>
                    <p className="text-[11px] lowercase tracking-tight text-muted-foreground/50">{customer.email}</p>
                  </td>
                  <td className="p-6">
                    <span className={`inline-block rounded-none border px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] ${tier.color}`}>
                      {tier.label}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className="font-mono text-[12px] text-muted-foreground/60">{customer.totalOrders}</span>
                  </td>
                  <td className="p-6">
                    <span className="font-mono text-[12px] font-bold text-accent">{customer.loyaltyPoints}</span>
                  </td>
                  <td className="p-6 text-right">
                    <p className="font-serif text-[18px] italic text-foreground">{formatUsd(customer.totalSpent)}</p>
                  </td>
                </motion.tr>
              )
            })}
          </AnimatePresence>
        </tbody>
      </table>
      </div>
    </div>
  )
}
