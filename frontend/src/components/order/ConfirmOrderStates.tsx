import { Link } from "react-router-dom"

type OrderCompletedStateProps = {
  completedOrderCode: string
  onGoPortfolio: () => void
}

export function IdentificationRequiredState() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center space-y-12 py-20 text-center">
      <h1 className="font-serif text-5xl tracking-tighter text-foreground md:text-7xl">
        Identification Required
      </h1>
      <p className="font-serif text-lg italic text-muted-foreground lg:max-w-xl">
        Please login as a verified member to proceed with this acquisition and record your investment in the house ledger.
      </p>
      <Link
        to="/user"
        className="rounded-sm bg-foreground px-12 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-background shadow-editorial transition-all duration-700 hover:bg-accent hover:text-white"
      >
        Sign In to Archive
      </Link>
    </section>
  )
}

export function OrderCompletedState({ completedOrderCode, onGoPortfolio }: OrderCompletedStateProps) {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center space-y-16 py-20 text-center">
      <div className="space-y-6">
        <p className="small-caps text-accent">Acquisition Finalized</p>
        <h1 className="font-serif text-6xl leading-none tracking-tighter text-foreground md:text-9xl">
          Signature <br />
          <span className="italic opacity-80">Verified</span>
        </h1>
        <p className="text-xl font-serif text-muted-foreground">
          Order Reference: <span className="border-b border-accent pb-1 text-foreground">{completedOrderCode}</span>
        </p>
      </div>
      <div className="rounded-md border border-border bg-secondary p-10 font-serif text-lg italic leading-relaxed text-muted-foreground">
        Your allocation has been recorded in the permanent global ledger. Our heritage specialists will now begin the final technical inspection and logistics orchestration for your curated selection.
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        <Link
          to="/collections"
          className="rounded-sm border border-border px-12 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground transition-all duration-700 hover:border-accent hover:text-accent"
        >
          New Discovery
        </Link>
        <button
          onClick={onGoPortfolio}
          className="rounded-sm bg-foreground px-12 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-background shadow-editorial transition-all duration-700 hover:bg-accent hover:text-white"
        >
          Access Portfolio
        </button>
      </div>
    </section>
  )
}
