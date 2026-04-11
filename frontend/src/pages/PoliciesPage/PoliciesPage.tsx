const sectionTitleClass = "font-serif text-3xl md:text-4xl text-foreground"
const bodyClass = "text-sm md:text-base leading-8 text-muted-foreground"

const PoliciesPage = () => {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-14 px-6 py-10 md:px-10 md:py-14">
      <header className="space-y-4 border-b border-border pb-8">
        <p className="small-caps text-accent">Customer Policies</p>
        <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-foreground">Privacy, Warranty & Returns</h1>
        <p className={bodyClass}>
          This page explains how HWJ handles your personal data, warranty service, and product return/exchange requests.
          By using our services, you agree to the policies below.
        </p>
      </header>

      <section className="space-y-5">
        <h2 className={sectionTitleClass}>1. Privacy Policy</h2>
        <div className="space-y-4">
          <p className={bodyClass}><strong className="text-foreground">Data we collect:</strong> full name, email, phone, shipping address, order records, and payment reference details.</p>
          <p className={bodyClass}><strong className="text-foreground">Purpose:</strong> process orders, provide support, improve service quality, prevent fraud, and comply with legal obligations.</p>
          <p className={bodyClass}><strong className="text-foreground">Data sharing:</strong> we do not sell personal data. We may share only necessary data with payment partners (PayPal), shipping providers, and trusted technical service providers.</p>
          <p className={bodyClass}><strong className="text-foreground">Storage and security:</strong> data is stored with access control and encrypted transmission. Data is retained only as long as required for business and legal purposes.</p>
          <p className={bodyClass}><strong className="text-foreground">Your rights:</strong> you may request access, correction, deletion, or restriction of your personal data by contacting HWJ support.</p>
        </div>
      </section>

      <section className="space-y-5 border-t border-border pt-10">
        <h2 className={sectionTitleClass}>2. Warranty Policy</h2>
        <div className="space-y-4">
          <p className={bodyClass}><strong className="text-foreground">Warranty period:</strong> 6 months from invoice date for manufacturing defects under normal use.</p>
          <p className={bodyClass}><strong className="text-foreground">Included care:</strong> complimentary cleaning and polishing support for up to 3 years.</p>
          <p className={bodyClass}><strong className="text-foreground">Not covered:</strong> misuse, impact damage, chemical damage, unauthorized repair, and normal wear.</p>
          <p className={bodyClass}><strong className="text-foreground">Service location:</strong> all warranty procedures must be completed at HWJ Service Center, 20 Cong Hoa Garden, Tan Binh Ward, HCMC.</p>
          <p className={bodyClass}><strong className="text-foreground">Required documents:</strong> order code or invoice and customer contact information used at purchase.</p>
        </div>
      </section>

      <section className="space-y-5 border-t border-border pt-10">
        <h2 className={sectionTitleClass}>3. Return & Exchange Policy</h2>
        <div className="space-y-4">
          <p className={bodyClass}><strong className="text-foreground">Time window:</strong> return or exchange requests must be submitted within 7 days from delivery/receipt date.</p>
          <p className={bodyClass}><strong className="text-foreground">Eligibility:</strong> product must be unused, unaltered, with original packaging and proof of purchase.</p>
          <p className={bodyClass}><strong className="text-foreground">Not eligible:</strong> custom/personalized items, damaged items due to improper use, and final-sale items (if marked).</p>
          <p className={bodyClass}><strong className="text-foreground">Refund method:</strong> approved refunds are processed to the original payment method (PayPal), subject to provider processing time.</p>
          <p className={bodyClass}><strong className="text-foreground">Exchange value:</strong> price difference is collected or refunded based on the final approved replacement item.</p>
        </div>
      </section>

      <section className="rounded-md border border-border bg-secondary/35 p-6 md:p-8">
        <p className="small-caps text-accent">Contact</p>
        <p className={bodyClass}><strong className="text-foreground">Service Center:</strong> HWJ, 20 Cong Hoa Garden, Tan Binh Ward, HCMC</p>
        <p className={bodyClass}><strong className="text-foreground">Support email:</strong> huylggcs230377@fpt.edu.vn</p>
      </section>
    </div>
  )
}

export default PoliciesPage
