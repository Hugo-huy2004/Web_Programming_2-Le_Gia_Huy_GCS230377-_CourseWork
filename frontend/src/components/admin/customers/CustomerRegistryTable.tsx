import { AnimatePresence, motion } from "framer-motion"
import type { CustomerAccount } from "@/types/store"

type TierInfo = {
  label: string
  color: string
}

type CustomerRegistryTableProps = {
  customers: CustomerAccount[]
  formatUsd: (value: number) => string
  getTierLabel: (spent: number) => TierInfo
  onOpenDossier: (customer: CustomerAccount) => void
}

export function CustomerRegistryTable({ customers, formatUsd, getTierLabel, onOpenDossier }: CustomerRegistryTableProps) {
  return (
    <div className="overflow-hidden rounded-sm border border-border/40 bg-white shadow-editorial">
      <div className="overflow-x-auto">
      <table className="min-w-[760px] w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border/40 bg-secondary/30">
            <th className="small-caps p-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground">Legal Identity / Email</th>
            <th className="small-caps p-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground">Tier</th>
            <th className="small-caps p-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground">Acq.</th>
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
                  onClick={() => onOpenDossier(customer)}
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
