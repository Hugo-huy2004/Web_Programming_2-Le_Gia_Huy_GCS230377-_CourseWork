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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        <div className="lg:col-span-7">
          <div className="p-5 md:p-12 bg-white border border-border rounded-sm shadow-sm space-y-6 md:space-y-10">
            <div className="space-y-1">
              <p className="small-caps text-accent">Liaison Request</p>
              <h3 className="font-serif text-xl md:text-2xl italic">Private Inquiry</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="small-caps text-[10px] text-muted-foreground">Inquiry Manifest</label>
                <Textarea
                  id="support-message"
                  value={message}
                  onChange={handleMessageChange}
                  placeholder="How may we elevate your presence today?"
                  className="min-h-[180px] md:min-h-[220px] border-border bg-secondary/10 focus-visible:border-accent rounded-sm p-4 md:p-6 text-base md:text-lg font-serif resize-none placeholder:italic"
                />
              </div>

              <button
                onClick={() => void onSubmitInquiry()}
                className="w-full py-4 md:py-5 bg-foreground text-background text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.24em] rounded-sm hover:bg-accent hover:text-white transition-all duration-700"
              >
                Dispatch Inquiry
              </button>

              <p className="text-[10px] font-serif italic text-muted-foreground/60 text-center">
                Priority handles within the house registry protocol: ~2 hour response orbit.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 md:p-10 bg-secondary/20 border border-border rounded-sm space-y-7 md:space-y-10 h-full">
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="small-caps text-[10px] text-foreground">Acquisition Services</p>
                <p className="text-[12px] font-serif italic text-muted-foreground leading-relaxed">
                  Global personal sourcing for specific historical reference numbers or high-rarity stones through our private heritage network.
                </p>
              </div>
              <div className="space-y-2">
                <p className="small-caps text-[10px] text-foreground">Maintenance & Heritage</p>
                <p className="text-[12px] font-serif italic text-muted-foreground leading-relaxed">
                  Expert museum-grade restoration, certification updates, and quarterly portfolio valuation audits for verified collectors.
                </p>
              </div>
              <div className="space-y-2">
                <p className="small-caps text-[10px] text-foreground">Private Viewings</p>
                <p className="text-[12px] font-serif italic text-muted-foreground leading-relaxed">
                  Orchestration of exclusive boardroom collection access or private laboratory tours for Diamond-tier members.
                </p>
              </div>
            </div>

            <div className="pt-8 border-t border-border/40">
              <div className="flex items-center gap-4 group">
                <div className="h-8 w-8 bg-white border border-border rounded-full flex items-center justify-center font-serif italic text-accent text-xs group-hover:border-accent transition-colors">
                  !
                </div>
                <p className="small-caps text-[9px] text-muted-foreground">Haus Support Protocol v4.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
