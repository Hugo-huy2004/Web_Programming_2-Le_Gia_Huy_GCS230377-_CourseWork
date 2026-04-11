import { Link } from "react-router-dom"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-20 hidden border-t border-border bg-secondary/35 md:block">
      <div className="mx-auto max-w-[1600px] px-6 py-12 md:px-12 md:py-14 lg:px-20">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-5">
            <Link to="/" className="inline-flex flex-col group">
              <span className="font-serif text-4xl leading-none tracking-tight text-foreground transition-colors group-hover:text-accent">
                HWJ
              </span>
              <span className="mt-2 text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                Heritage Atelier
              </span>
            </Link>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              Curated jewelry house rooted in heritage craftsmanship. Every piece is priced and verified through our internal registry standards.
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-2">
              <div className="rounded-md border border-border bg-background/70 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">House Registry</p>
                <p className="font-serif text-xl leading-tight text-foreground">Verified</p>
              </div>
              <div className="rounded-md border border-border bg-background/70 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Location</p>
                <p className="text-sm font-medium text-foreground">20 Cong Hoa Garden, Tan Binh Ward, HCMC</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-2">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Explore</p>
              <nav className="flex flex-col gap-2">
                <Link to="/collections" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Collections</Link>
                <Link to="/heritage" className="text-sm text-muted-foreground hover:text-foreground transition-colors">The Story</Link>
                <Link to="/valuation" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Metal Valuation</Link>
              </nav>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Service</p>
              <nav className="flex flex-col gap-2">
                <Link to="/user" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Account</Link>
                <Link to="/appointment" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Consultation</Link>
                <Link to="/policies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Policies</Link>
              </nav>
            </div>

            <div className="col-span-2 space-y-3 sm:col-span-1 lg:col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Institutional Anchor</p>
              <img
                src="https://greenwich.edu.vn/wp-content/uploads/2024/06/2022-Greenwich-Eng.webp"
                alt="Greenwich University"
                className="h-16 w-auto object-contain grayscale opacity-80 transition-opacity duration-500 hover:opacity-100"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            © {currentYear} HWJ House Heritage. Verified Archive Registry.
          </p>
          <p className="text-xs italic text-muted-foreground">Cong Hoa Garden, Tan Binh Ward, HCMC</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
