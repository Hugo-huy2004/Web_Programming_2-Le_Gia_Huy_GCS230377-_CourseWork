import { ShoppingBag } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useProductStore } from "../stores/useProductStore"
import { useSettingsStore } from "../stores/useSettingsStore"
import { useCartStore } from "../stores/useCartStore"
import { useCustomerStore } from "../stores/useCustomerStore"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const navigate = useNavigate()
  const { searchTerm, setSearchTerm } = useProductStore()
  const { cartCount } = useCartStore()
  const { currentAdmin } = useSettingsStore()
  const { activeCustomerEmail } = useCustomerStore()
  const totalCartItems = cartCount()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-700 ${isScrolled
          ? "py-3 bg-background/88 backdrop-blur-2xl border-b border-border shadow-editorial"
          : "py-4 bg-background/70 backdrop-blur-xl border-b border-border/40"
          }`}
      >
        <div className="mx-auto flex w-full max-w-[1800px] items-center px-4 md:px-12">
          <div className="flex-1 min-w-[140px] flex justify-start">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex flex-col">
                <span className="font-serif text-3xl font-normal tracking-tighter text-foreground transition-colors duration-700 group-hover:text-accent leading-none md:text-5xl">
                  HWJ
                </span>
                <span className="small-caps mt-1">Atelier Heritage</span>
              </div>
              <span className="font-serif text-3xl italic text-accent leading-none mt-1 md:text-4xl">.</span>
            </Link>
          </div>

          <div className="flex-[2] hidden xl:flex justify-center">
            <nav className="flex items-center gap-14 text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              {[
                { label: "Collections", path: "/collections" },
                { label: "Valuation", path: "/valuation" },
                { label: "The Story", path: "/heritage" }
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative group transition-colors duration-500 hover:text-foreground"
                >
                  {link.label}
                  <motion.span layoutId={`header-line-${link.path}`} className="absolute -bottom-2 left-0 w-0 h-px bg-accent transition-all duration-500 group-hover:w-full" />
                </Link>
              ))}
            </nav>
          </div>

          {/* R: Global Utilities */}
          <div className="flex-1 flex items-center justify-end gap-4 md:gap-8">
            <form
              className="group relative hidden w-[140px] items-center border-b border-border transition-all duration-700 focus-within:w-[200px] focus-within:border-accent md:flex"
              onSubmit={(event) => {
                event.preventDefault()
                navigate("/collections")
              }}
            >
              <input
                type="text"
                placeholder="Find in Archive"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value)
                  if (event.target.value.trim().length > 0) navigate("/collections")
                }}
                className="w-full bg-transparent px-1 py-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
              />
              <div className="absolute right-0 opacity-0 group-focus-within:opacity-100 transition-opacity">
                <span className="text-[10px] font-serif italic text-accent">↵</span>
              </div>
            </form>
            
            <div className="flex items-center gap-6 md:gap-10 text-[10px] items-center">
              <Link
                to="/user"
                className="hidden font-medium uppercase tracking-[0.1em] text-muted-foreground transition-colors duration-700 hover:text-foreground lg:block"
              >
                Account
              </Link>

              <button
                onClick={() => {
                  if (!totalCartItems && !currentAdmin && !activeCustomerEmail) {
                    navigate("/user")
                  } else {
                    navigate("/cart")
                  }
                }}
                id="global-cart-icon"
                className="group relative flex items-center gap-2 text-foreground transition-colors duration-700 hover:text-accent"
              >
                <ShoppingBag className="h-5 w-5 stroke-[1] transition-transform duration-700 group-hover:-translate-y-0.5" />
                <AnimatePresence>
                  {totalCartItems > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="absolute -right-2 -top-2 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-accent text-[8px] font-mono font-bold text-white shadow-[0_0_10px_rgba(212,175,55,0.4)] border border-background"
                    >
                      {totalCartItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <Link
                to="/appointment"
                className="rounded-full border border-foreground/20 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-foreground transition-colors hover:border-accent hover:bg-accent hover:text-white md:hidden"
              >
                Consultation
              </Link>

              <Link
                to="/appointment"
                className="group relative hidden overflow-hidden rounded-md border border-foreground/10 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground transition-all duration-700 hover:border-accent lg:block"
              >
                <div className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
                <span className="relative z-10 group-hover:text-white transition-colors duration-500 whitespace-nowrap">Acquisition Consultation</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}