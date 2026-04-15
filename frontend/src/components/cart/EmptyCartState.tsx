import { Link } from "react-router-dom"

export function EmptyCartState() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 px-4 md:space-y-10">
      <div className="space-y-3 text-center md:space-y-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent md:font-bold md:tracking-[0.4em]">Vault Status: Empty</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:font-serif md:text-7xl md:italic md:tracking-tighter">Your cart is empty</h1>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
          Your personal portfolio has no acquisitions yet. Explore our curated collections to begin your legacy.
        </p>
      </div>
      <Link
        to="/collections"
        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-sm border border-border px-6 py-3 transition-all duration-500 hover:border-accent md:gap-6 md:px-12 md:py-5 md:duration-700"
      >
        <div className="absolute inset-0 -translate-x-full bg-foreground transition-transform duration-700 group-hover:translate-x-0" />
        <span className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground transition-colors duration-500 group-hover:text-background md:font-bold md:tracking-[0.3em]">
          Discover Collections
        </span>
        <span className="relative z-10 text-lg text-accent transition-transform duration-500 group-hover:translate-x-2 md:font-serif md:text-xl">
          →
        </span>
      </Link>
    </section>
  )
}
