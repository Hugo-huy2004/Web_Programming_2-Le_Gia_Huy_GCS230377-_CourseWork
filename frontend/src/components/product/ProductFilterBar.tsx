
type ProductFilterBarProps = {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

export function ProductFilterBar({
  categories,
  selectedCategory,
  onSelectCategory,
}: ProductFilterBarProps) {
  return (
    <nav className="sticky top-16 z-40 overflow-hidden border-y border-border bg-background/75 backdrop-blur-xl md:top-20">
      <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 py-3 scroll-smooth sm:px-6 md:gap-x-12 md:py-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`relative flex-shrink-0 snap-start whitespace-nowrap rounded-full border px-4 py-2 text-[10px] font-medium uppercase tracking-[0.16em] transition-all duration-500 md:rounded-none md:border-transparent md:px-0 md:py-2 md:text-[11px] md:tracking-[0.2em] ${
              selectedCategory === category
                ? "border-foreground bg-foreground text-background md:bg-transparent md:text-foreground"
                : "border-border/40 text-muted-foreground/55 hover:text-foreground md:text-muted-foreground/40 md:hover:text-accent"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </nav>
  )
}
