import { useEffect, useState } from "react"
import { useUiStore } from "@/stores/useUiStore"

export default function GlobalLoadingOverlay() {
  const pendingRequests = useUiStore((state) => state.pendingRequests)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (pendingRequests > 0) {
      const timer = window.setTimeout(() => {
        setIsVisible(true)
      }, 180)
      return () => window.clearTimeout(timer)
    }

    setIsVisible(false)
    return undefined
  }, [pendingRequests])

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-background/35 backdrop-blur-md transition-opacity duration-200 ${
        isVisible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isVisible}
    >
      <div className="liquid-glass-strong flex items-center gap-4 rounded-sm border border-border/50 px-6 py-4 shadow-editorial">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
        <p className="small-caps text-[10px] font-bold tracking-[0.18em] text-foreground">Processing Request...</p>
      </div>
    </div>
  )
}
