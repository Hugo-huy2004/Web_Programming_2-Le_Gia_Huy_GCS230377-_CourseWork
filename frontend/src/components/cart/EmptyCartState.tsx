import { Link } from "react-router-dom"

export function EmptyCartState() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center space-y-10">
      <div className="space-y-4 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent">Vault Status: Empty</p>
        <h1 className="font-serif text-4xl italic tracking-tighter text-foreground md:text-7xl">The Curation is Awaiting</h1>
        <p className="mx-auto max-w-md text-sm font-light leading-relaxed text-muted-foreground">
          Your personal portfolio has no acquisitions yet. Explore our curated collections to begin your legacy.
        </p>
      </div>
      <Link
        to="/collections"
        className="group relative inline-flex items-center gap-6 overflow-hidden rounded-sm border border-border px-12 py-5 transition-all duration-700 hover:border-accent"
      >
        <div className="absolute inset-0 -translate-x-full bg-foreground transition-transform duration-700 group-hover:translate-x-0" />
        <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.3em] text-foreground transition-colors duration-500 group-hover:text-background">
          Discover Collections
        </span>
        <span className="relative z-10 font-serif text-xl text-accent transition-transform duration-500 group-hover:translate-x-2">
          →
        </span>
      </Link>
    </section>
  )
}
