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
    <section className="mx-auto flex min-h-[64vh] w-full max-w-3xl flex-col items-center justify-center space-y-5 py-8 text-center md:min-h-[70vh] md:space-y-16 md:py-20">
      <div className="w-full rounded-sm border border-border/60 bg-gradient-to-b from-secondary/70 to-background p-4 shadow-sm md:space-y-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-accent md:small-caps md:tracking-normal">Acquisition Finalized</p>
        <h1 className="mt-2 text-4xl font-semibold leading-[0.9] tracking-tight text-foreground md:mt-0 md:font-serif md:text-9xl md:tracking-tighter">
          Signature <br />
          <span className="italic opacity-85">Verified</span>
        </h1>
        <p className="mt-3 text-[11px] text-muted-foreground/85 md:mt-0 md:text-xl md:font-serif md:text-muted-foreground">
          Order Reference
          <span className="ml-2 inline-block rounded-sm border border-accent/40 bg-accent/5 px-2 py-1 text-[10px] font-semibold tracking-[0.06em] text-foreground md:ml-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:text-inherit md:font-normal md:tracking-normal">
            {completedOrderCode}
          </span>
        </p>
      </div>
      <div className="rounded-sm border border-border/60 bg-secondary/35 p-3 text-left text-[12px] leading-relaxed text-muted-foreground/85 md:rounded-md md:border-border md:bg-secondary md:p-10 md:text-center md:font-serif md:text-lg md:italic md:text-muted-foreground">
        Your allocation has been recorded in the permanent global ledger. Our heritage specialists will now begin final inspection and logistics orchestration for your curated selection.
      </div>
      <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:flex-wrap md:justify-center md:gap-8">
        <Link
          to="/collections"
          className="h-10 rounded-sm border border-border px-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground transition-all duration-300 hover:border-accent hover:text-accent md:h-auto md:px-12 md:py-5 md:text-[11px] md:font-bold md:tracking-[0.2em] md:duration-700"
        >
          New Discovery
        </Link>
        <button
          onClick={onGoPortfolio}
          className="h-10 rounded-sm bg-foreground px-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-background shadow-editorial transition-all duration-300 hover:bg-accent hover:text-white md:h-auto md:px-12 md:py-5 md:text-[11px] md:font-bold md:tracking-[0.2em] md:duration-700"
        >
          Access Portfolio
        </button>
      </div>
    </section>
  )
}
