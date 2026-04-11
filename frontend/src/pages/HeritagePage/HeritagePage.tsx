import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useProductStore } from "../../stores/useProductStore"

const milestones = [
  {
    year: "2010",
    title: "Founding Vision: The Golden Ratio",
    desc: "The House was established with a singular mandate: to bridge the gap between traditional Vietnamese goldsmithing and modern ergonomic precision. Our first atelier was a laboratory of form.",
  },
  {
    year: "2016",
    title: "The Wishpax Signature",
    desc: "After years of structural research, we introduced the signature Wishpax Setting. A multidimensional mounting technique that allows light to penetrate the pavilion with zero interference, maximizing brilliance.",
  },
  {
    year: "2021",
    title: "The Digital Renaissance",
    desc: "We transitioned into an online-first curatorial model, providing private high-jewelry consultations to a global elite while maintaining the intimacy of an invite-only master studio.",
  },
  {
    year: "2024",
    title: "Cong Hoa Sanctuary",
    desc: "Our current headquarters opened in Cong Hoa Garden—a dedicated sanctuary for design excellence, private provenance research, and multi-generational heritage restoration.",
  },
]

const values = [
  {
    title: "Manual Precision",
    desc: "We reject the clinical soullessness of mass production. Every curve of an HWJ piece is filed, polished, and set by the hands of a master who has spent decades refining their sense of touch.",
  },
  {
    title: "Ethical Metallic Integrity",
    desc: "Our commitment to 24K and 18K gold is absolute. We source only from verified refiners, ensuring that the material of your legacy is as untainted as the memory it preserves.",
  },
  {
    title: "The Archive Mentality",
    desc: "We do not believe in seasonal trends. We create 'Archives'—pieces that are historically conscious yet technically progressive, designed to outlast the wearer and the era.",
  },
  {
    title: "Absolute Discretion",
    desc: "The acquisition of high jewelry is a deeply personal act. From the first sketch to the final registry entry, our clients' privacy is the foundation of our institutional trust.",
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const HeritagePage = () => {
  const { products, getProductPricing } = useProductStore()

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val)

  const featuredProducts = products.slice(0, 4)

  return (
    <section className="relative space-y-8 overflow-hidden pb-24 md:space-y-32 md:pb-32 font-sans selection:bg-accent/20">
      <div className="ambient-glow opacity-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
        className="relative border-b border-border/40 pb-10 pt-4 md:pb-16 md:pt-24"
      >
        <div className="mb-8 flex items-center gap-3 md:mb-10 md:gap-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Institutional Heritage</p>
          <div className="h-px w-8 bg-accent opacity-30 md:w-12" />
          <p className="text-[10px] font-bold uppercase tracking-widest font-mono text-muted-foreground/40">Registry No. 1021-HCMC</p>
        </div>

        <h1 className="mb-6 font-serif text-[2.15rem] leading-[0.95] tracking-tighter text-foreground sm:text-6xl md:mb-16 md:text-[8rem] lg:text-[10rem]">
          The Art of <br />
          <span className="italic text-accent opacity-90">Preservation</span>
        </h1>

        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end lg:gap-16">
          <p className="max-w-2xl font-serif text-[17px] italic leading-relaxed text-muted-foreground md:text-xl">
            "We do not merely create jewelry; we orchestrate high-purity gold into physical archives of your legacy."
            Perched within the sanctuary of Cong Hoa Garden, the HWJ Atelier is a space where
            Vietnamese heritage meets the uncompromising standards of modern high-jewelry.
          </p>
          <div className="hidden lg:flex flex-col items-end gap-2 text-right border-l border-accent/20 pl-8">
            <span className="text-[9px] font-bold uppercase tracking-widest text-accent">Atelier Location</span>
            <p className="font-serif text-lg italic text-foreground opacity-80 leading-snug">
              Cong Hoa Garden, Ward 12<br />
              Tan Binh District, HCMC
            </p>
          </div>
        </div>
      </motion.div>

      {/* Narrative Section: The Art of the Goldsmith */}
      <div className="grid grid-cols-1 items-center gap-8 md:gap-24 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="relative aspect-[4/5] bg-secondary/30 overflow-hidden rounded-2xl border border-border/40 shadow-[0_30px_70px_-35px_rgba(0,0,0,0.5)] group md:rounded-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 mix-blend-overlay" />
          <img
            src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=2000&auto=format&fit=crop"
            alt="Goldsmith Craft"
            className="h-full w-full object-cover grayscale opacity-85 transition-all duration-[3s] group-hover:scale-105 group-hover:grayscale-0"
          />
          <div className="absolute bottom-6 left-6 z-20 md:bottom-10 md:left-10">
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/70 mb-2">In the Hands of the Master</p>
            <h3 className="font-serif text-3xl md:text-4xl italic text-white">Manual Precision</h3>
          </div>
        </motion.div>
        <div className="space-y-6 rounded-2xl border border-border/30 bg-background/70 p-6 backdrop-blur-[1px] md:space-y-12 md:rounded-none md:border-0 md:bg-transparent md:p-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Chapter I</span>
          <h2 className="font-serif text-[2rem] leading-[1.05] tracking-tighter text-foreground md:text-5xl lg:text-7xl">The Dialogue of <br /><span className="italic text-accent">Fire & Gold</span></h2>
          <div className="max-w-lg space-y-5 font-serif text-[15px] italic leading-relaxed text-muted-foreground md:space-y-6 md:text-base">
            <p>
              In our Atelier, we observe the ancient dialogue between flame and metal. High-purity 24K gold requires a temperament of patience; it does not yield easily to the machine. It demands the rhythmic strike of the hammer and the discerning eye of a master who understands the soul of the material.
            </p>
            <p>
              Each piece undergoes over 120 hours of manual refinement, ensuring that every bezel and prong is structurally sound enough to last for generations.
            </p>
          </div>
        </div>
      </div>

      {/* Historical Milestones */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="space-y-10 border-y border-border/30 py-12 md:space-y-24 md:py-24"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-12">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-7xl text-foreground tracking-tighter">The Chronicle</h2>
          <div className="h-px flex-1 bg-border/40 hidden md:block mb-4" />
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 hidden md:block mb-4">Historical Registry</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:gap-x-24 lg:gap-y-24">
          {milestones.map(({ year, title, desc }) => (
            <motion.article
              key={year}
              variants={fadeUp}
              className="group rounded-2xl border border-border/40 bg-background/80 p-5 transition-all duration-700 hover:border-accent md:rounded-none md:border-l md:border-y-0 md:border-r-0 md:bg-transparent md:py-2 md:pl-12 md:pr-0"
            >
              <div className="flex items-center gap-4 mb-4 md:mb-6">
                <span className="font-serif text-xl md:text-2xl italic text-accent opacity-70">{year}</span>
                <div className="h-px w-8 bg-accent/20" />
              </div>
              <h3 className="mb-3 font-serif text-[1.55rem] leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent md:mb-6 md:text-4xl">{title}</h3>
              <p className="max-w-md font-serif text-[15px] italic leading-relaxed text-muted-foreground md:text-base">{desc}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>

      {/* Masterpieces Gallery: The Curated Archive */}
      {featuredProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="space-y-8 py-6 md:space-y-24 md:py-16"
        >
          <div className="flex flex-col justify-between gap-5 border-b border-border/30 pb-8 md:flex-row md:items-end md:gap-8 md:pb-16">
            <h2 className="font-serif text-[1.95rem] leading-none tracking-tighter text-foreground md:text-7xl lg:text-8xl">The Curated <br /><span className="italic text-accent opacity-90">Archive</span></h2>
            <div className="flex flex-col items-start gap-4 md:items-end md:gap-6 md:text-right">
              <p className="max-w-sm font-serif text-[15px] italic leading-relaxed text-muted-foreground md:text-base">
                A selection of pieces currently residing in our vault. Each item is unique, representing the pinnacle of House artistry.
              </p>
              <Link to="/collections" className="group border-b border-accent/20 pb-1 text-[10px] font-bold uppercase tracking-widest text-accent transition-all duration-500 hover:border-foreground hover:text-foreground md:text-[10px]">
                Deep Access: Full Archive <span className="inline-block group-hover:translate-x-2 transition-transform opacity-70">→</span>
              </Link>
            </div>
          </div>

          <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 pt-1 scrollbar-none sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-7 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4 xl:gap-10">
            {featuredProducts.map((product) => {
              const pricing = getProductPricing(product)
              return (
                <motion.div
                  key={product.id}
                  variants={fadeUp}
                  className="w-[78vw] max-w-[320px] flex-none snap-start sm:w-[56vw] md:w-auto md:max-w-none md:flex-initial"
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="group block overflow-hidden rounded-xl border border-border/30 bg-gradient-to-b from-background to-muted/10 p-3 shadow-[0_18px_44px_-36px_rgba(0,0,0,0.35)] transition-all duration-700 hover:border-accent/35 md:space-y-8 md:rounded-sm md:border-0 md:bg-transparent md:p-0 md:shadow-none"
                  >
                    <div className="aspect-[4/5] overflow-hidden rounded-lg border border-border/35 bg-secondary/30 transition-all duration-1000 group-hover:border-accent/35 md:rounded-sm">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover mix-blend-multiply opacity-80 transition-all duration-[2s] ease-out group-hover:scale-105 group-hover:opacity-100"
                      />
                    </div>
                    <div className="space-y-2 px-1 pb-1 pt-3 text-left md:pt-0">
                      <div className="flex items-center justify-between gap-4 opacity-70 transition-opacity group-hover:opacity-100">
                        <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">{product.category}</p>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">{product.metalType}</p>
                      </div>
                      <h4 className="line-clamp-1 font-serif text-[1.35rem] italic tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-[1.45rem]">{product.name}</h4>
                      <p className="font-serif text-base tracking-tight text-muted-foreground/80">{formatCurrency(pricing.finalPrice)}</p>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Material & Provenance Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="relative mt-8 overflow-hidden rounded-sm border border-border/40 bg-foreground px-5 py-14 text-background md:mt-24 md:p-24 lg:p-32"
      >
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.03] to-transparent pointer-events-none" />

        <div className="max-w-5xl space-y-16 md:space-y-24 relative z-10 mx-auto text-center md:text-left">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent/80 mb-6 block">Chapter II</span>
          <h2 className="font-serif text-3xl leading-[1.15] tracking-tighter text-white sm:text-5xl md:text-7xl lg:text-8xl">Material Consistency <br />& Ethical Providence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 text-left">
            <div className="space-y-5 border-t border-white/10 pt-8 md:space-y-8 md:border-transparent md:pt-0">
              <h4 className="font-serif text-2xl md:text-3xl italic text-accent opacity-90">24K & 18K Integrity</h4>
              <p className="text-sm md:text-base leading-[2] opacity-70 font-serif italic tracking-tight max-w-sm">
                The House exclusively works with metals of verified purity. Our 24K gold is soft yet resilient, a material that retains the warmth of the artisans who shaped it.
              </p>
            </div>
            <div className="space-y-6 md:space-y-8">
              <h4 className="font-serif text-2xl md:text-3xl italic text-accent opacity-90">Traceable Legacy</h4>
              <p className="text-sm md:text-base leading-[2] opacity-70 font-serif italic tracking-tight max-w-sm">
                Every piece is accompanied by a unique digital marker in our institutional registry, guaranteeing provenance, weight, and history for the next generation.
              </p>
            </div>
            <div className="space-y-5 border-t border-white/10 pt-8 md:space-y-8 md:border-transparent md:pt-0">
              <h4 className="font-serif text-2xl italic text-accent">Sourced by Eye</h4>
              <p className="text-[14px] leading-relaxed opacity-60 font-sans tracking-tight">
                No gemstone enters the Atelier without individual inspection under 10x magnification by our head curator. If the stone lacks brilliance or provenance, it lacks the spirit for HWJ.
              </p>
            </div>
          </div>

          <div className="space-y-8 border-t border-white/15 pt-12">
            <h4 className="font-serif text-3xl italic text-accent">Precious Metal Accuracy & Service Policy</h4>
            <p className="text-[15px] leading-relaxed opacity-80 font-sans tracking-tight">
              HWJ always uses the declared composition percentages for precious-metal fabrication, with a practical tolerance of +/- 0.8%.
              For Silver 9999, we prioritize true 9999 silver, meaning 99.99% pure silver content.
            </p>
            <p className="text-[15px] leading-relaxed opacity-80 font-sans tracking-tight">
              Pre-owned jewelry buyback and old-for-new exchange services are performed exclusively at HWJ headquarters.
            </p>

            <div className="space-y-4">
              <p className="small-caps text-accent text-[11px]">Mandatory Intake Procedure</p>
              <ul className="space-y-3 text-[14px] leading-relaxed opacity-80 font-sans tracking-tight list-disc pl-5">
                <li>Initial weight measurement.</li>
                <li>Full surface cleaning to remove dust and residue.</li>
                <li>Second weight measurement and spectrometric analysis to verify silver percentage.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <p className="small-caps text-accent text-[11px]">Silver Buyback Rule</p>
              <p className="text-[14px] leading-relaxed opacity-80 font-sans tracking-tight">
                Customers selecting silver buyback are paid on 70% of the pure silver content in the product.
                Example: a 1 mace ring at 92.5% purity contains 0.925 mace pure silver;
                buyback value is 70% of that amount, i.e. 0.65 mace multiplied by the current silver price.
              </p>
            </div>

            <div className="space-y-4">
              <p className="small-caps text-accent text-[11px]">Silver Exchange Rule</p>
              <p className="text-[14px] leading-relaxed opacity-80 font-sans tracking-tight">
                Customers selecting silver exchange receive exact Silver 9999-equivalent weight credit.
                Example: for 1 mace of 925 silver, HWJ credits 0.925 mace toward new Silver 9999 products.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Core Principles Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="space-y-20 py-10"
      >
        <div className="flex items-center gap-6">
          <h2 className="font-serif text-4xl md:text-6xl text-foreground">The Principles</h2>
          <div className="h-px flex-1 bg-border/40" />
        </div>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ title, desc }) => (
            <motion.article
              key={title}
              variants={fadeUp}
              className="group border-t border-border/40 pt-10 transition-all duration-700 hover:border-accent"
            >
              <p className="small-caps text-[10px] text-accent mb-8 tracking-[0.3em] font-medium">{title}</p>
              <p className="text-[15px] leading-[1.8] text-muted-foreground font-serif italic tracking-tight opacity-80">{desc}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>

      {/* The Atelier Visit - Premium CTA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
        className="relative overflow-hidden rounded-sm border border-border/40 bg-muted px-5 py-14 text-center md:px-12 md:py-40"
      >
        <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
        <span className="small-caps mb-8 inline-block text-[10px] font-bold tracking-[0.34em] text-accent md:mb-12 md:text-[11px] md:tracking-[0.5em]">The Private Studio</span>
        <h2 className="mb-10 font-serif text-4xl leading-[0.9] tracking-tighter text-foreground md:mb-20 md:text-[8rem]">Visit the Atelier</h2>

        <div className="mx-auto mb-12 grid max-w-5xl gap-8 border-y border-border/20 py-10 text-left md:mb-24 md:grid-cols-2 md:gap-16 md:py-16">
          <div className="space-y-4 border-l border-accent/20 pl-6 md:space-y-6 md:pl-10">
            <p className="small-caps text-accent text-[11px]">Archive Registry Location</p>
            <p className="font-serif text-lg italic tracking-tight text-foreground md:text-xl">
              Atelier 20, Cong Hoa Garden<br />
              Ward 12, Tan Binh District<br />
              Ho Chi Minh City, Vietnam
            </p>
          </div>
          <div className="space-y-4 border-l border-accent/20 pl-6 md:space-y-6 md:pl-10">
            <p className="small-caps text-accent text-[11px]">Heritage Connection</p>
            <p className="font-serif text-lg italic tracking-tight text-foreground md:text-xl">
              T: +84 839 909 388<br />
              E: huylggcs230377@fpt.edu.vn<br />
              Private Consultations by Registry Only.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-6 md:gap-10">
          <Link
            to="/appointment"
            className="w-full rounded-sm bg-foreground px-8 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-background transition-all duration-1000 hover:bg-accent hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] sm:w-auto sm:px-14 sm:py-6 sm:text-[12px] sm:tracking-[0.3em]"
          >
            Request Consultation
          </Link>
          <Link
            to="/collections"
            className="w-full rounded-sm border border-border/60 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-foreground transition-all duration-700 hover:border-accent hover:text-accent sm:w-auto sm:px-14 sm:py-6 sm:text-[12px] sm:tracking-[0.3em]"
          >
            Digital Archive
          </Link>
        </div>
      </motion.div>

    </section>
  )
}

export default HeritagePage