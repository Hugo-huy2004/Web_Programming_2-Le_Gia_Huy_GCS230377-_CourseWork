import { motion } from "framer-motion"
import { useEffect } from "react"
import { usePriceStore } from "@/stores/usePriceStore"
import { formatUsd } from "@/lib/formatUtils"
import { getMetalValuationRows } from "@/lib/metalPriceView"
import { toast } from "sonner"

const ValuationPage = () => {
  const { goldSnapshot, goldLoading, goldError, refreshGoldPrices } = usePriceStore()

  useEffect(() => {
    void refreshGoldPrices()
  }, [refreshGoldPrices])

  useEffect(() => {
    if (!goldError) {
      toast.dismiss("valuation-sync-error")
      return
    }

    toast.error(goldError, { id: "valuation-sync-error", duration: 4000 })
  }, [goldError])

  const valuationRows = goldSnapshot ? getMetalValuationRows(goldSnapshot) : []

  return (
    <div className="animate-in fade-in duration-1000 space-y-12 pb-20 mx-auto w-full max-w-[1400px] px-6 md:px-12 pt-10 md:pt-16">
      <header className="pb-8 border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-4 md:space-y-6"
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Market Intelligence</p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-foreground tracking-tighter leading-none italic">
            Live Valuation
          </h1>
          <p className="max-w-2xl text-sm md:text-base leading-relaxed text-muted-foreground font-serif italic">
            Live market-based insight for pure gold and silver standards, curated in mace metric for our collectors.
          </p>
        </motion.div>
      </header>

      {goldSnapshot && (
        <div className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border/50 pb-6">
            <div className="flex items-center gap-3 bg-secondary/30 px-4 py-2 rounded-sm border border-border/50">
              <div className={`h-1.5 w-1.5 rounded-full ${goldLoading ? "bg-accent animate-pulse" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"}`} />
              <p className="font-mono text-[9px] font-bold text-muted-foreground/80 uppercase tracking-widest mt-0.5">
                {goldLoading ? "Synchronizing Live..." : `Verified: ${goldSnapshot.time}`}
              </p>
            </div>
          </div>

          <div className="mx-auto w-full overflow-hidden rounded-sm border border-border/60 shadow-2xl shadow-accent/5 bg-background">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full table-fixed text-center">
                <thead className="bg-foreground text-background">
                  <tr>
                    <th className="w-1/3 px-6 py-5 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] border-b border-border/20">Metal Standard</th>
                    <th className="w-1/3 px-6 py-5 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] border-b border-border/20 border-l border-background/20">Sell Price per Mace</th>
                    <th className="w-1/3 px-6 py-5 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] border-b border-border/20 border-l border-background/20">Buyback Price per Mace</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {valuationRows.map((row, index) => (
                    <tr key={row.type} className={`transition-colors duration-500 hover:bg-secondary/40 ${index % 2 === 0 ? "bg-background" : "bg-secondary/10"}`}>
                      <td className="px-6 py-6 text-xs md:text-sm font-bold uppercase tracking-widest text-foreground/80 border-r border-border/40">{row.type}</td>
                      <td className="px-6 py-6 font-serif text-xl md:text-3xl text-foreground whitespace-nowrap italic border-r border-border/40">{formatUsd(row.sellPrice)}</td>
                      <td className="px-6 py-6 font-serif text-xl md:text-3xl text-foreground whitespace-nowrap italic">{formatUsd(row.buybackPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ValuationPage
