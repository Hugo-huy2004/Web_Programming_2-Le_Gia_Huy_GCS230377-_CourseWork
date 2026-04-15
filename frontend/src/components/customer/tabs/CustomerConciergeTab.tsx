import { Textarea } from "@/components/ui/textarea"
import type { ChangeEvent } from "react"

type CustomerConciergeTabProps = {
  message: string
  onMessageChange: (message: string) => void
  onSubmitInquiry: () => Promise<void>
}

export function CustomerConciergeTab({
  message,
  onMessageChange,
  onSubmitInquiry,
}: CustomerConciergeTabProps) {
  const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onMessageChange(event.target.value)
  }

  return (
    <div className="animate-in fade-in duration-700 max-w-5xl">
      <div className="grid grid-cols-1 gap-4 md:gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="space-y-4 rounded-sm border border-border bg-white p-3 shadow-sm md:space-y-10 md:p-12">
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-accent md:small-caps">Liaison Request</p>
              <h3 className="text-lg font-semibold md:font-serif md:text-2xl md:italic">Private Inquiry</h3>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="space-y-2 md:space-y-3">
                <label className="text-[10px] font-medium text-muted-foreground md:small-caps">Inquiry Manifest</label>
                <Textarea
                  id="support-message"
                  value={message}
                  onChange={handleMessageChange}
                  placeholder="How may we elevate your presence today?"
                  className="min-h-[150px] resize-none rounded-sm border border-border bg-secondary/10 p-3 text-sm focus-visible:border-accent md:min-h-[220px] md:p-6 md:text-lg md:font-serif md:placeholder:italic"
                />
              </div>

              <button
                onClick={() => void onSubmitInquiry()}
                className="w-full rounded-sm bg-foreground py-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-background transition-all duration-300 hover:bg-accent hover:text-white md:py-5 md:text-[11px] md:font-bold md:tracking-[0.24em] md:duration-700"
              >
                Dispatch Inquiry
              </button>

              <p className="text-center text-[10px] text-muted-foreground/70 md:font-serif md:italic md:text-muted-foreground/60">
                Priority handles within the house registry protocol: ~2 hour response orbit.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-5 lg:space-y-6">
          <div className="h-full space-y-4 rounded-sm border border-border bg-secondary/20 p-3 md:space-y-10 md:p-10">
            <div className="space-y-4 md:space-y-8">
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground md:small-caps">Acquisition Services</p>
                <p className="text-[12px] leading-relaxed text-muted-foreground md:font-serif md:italic">
                  Global personal sourcing for specific historical reference numbers or high-rarity stones through our private heritage network.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground md:small-caps">Maintenance & Heritage</p>
                <p className="text-[12px] leading-relaxed text-muted-foreground md:font-serif md:italic">
                  Expert museum-grade restoration, certification updates, and quarterly portfolio valuation audits for verified collectors.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground md:small-caps">Private Viewings</p>
                <p className="text-[12px] leading-relaxed text-muted-foreground md:font-serif md:italic">
                  Orchestration of exclusive boardroom collection access or private laboratory tours for Diamond-tier members.
                </p>
              </div>
            </div>

            <div className="border-t border-border/40 pt-4 md:pt-8">
              <div className="flex items-center gap-4 group">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-white text-[11px] text-accent transition-colors group-hover:border-accent md:h-8 md:w-8 md:font-serif md:italic md:text-xs">
                  !
                </div>
                <p className="text-[10px] font-medium text-muted-foreground md:small-caps md:text-[9px]">Haus Support Protocol v4.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
