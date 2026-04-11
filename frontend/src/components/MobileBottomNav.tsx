import { Home, Gem, LineChart, User } from "lucide-react"
import { NavLink } from "react-router-dom"

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/collections", label: "Shop", icon: Gem },
  { to: "/valuation", label: "Valuation", icon: LineChart },
  { to: "/user", label: "Account", icon: User },
]

export default function MobileBottomNav() {
  return (
    <nav className="mobile-app-nav fixed inset-x-0 bottom-0 z-[55] px-3 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] pt-2 md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1.5 rounded-2xl border border-border/80 bg-background/92 p-1.5 shadow-[0_8px_28px_rgba(0,0,0,0.12)] backdrop-blur-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `relative flex min-h-[56px] flex-col items-center justify-center rounded-xl px-2 py-1.5 transition-all ${
                  isActive ? "bg-accent/12 text-accent" : "text-muted-foreground"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em]">{tab.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
