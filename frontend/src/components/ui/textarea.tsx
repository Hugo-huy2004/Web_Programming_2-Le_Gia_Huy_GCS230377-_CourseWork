import * as React from "react"
import { cn } from "@/lib/utils"

type TextareaProps = React.ComponentProps<"textarea">

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[104px] w-full border-0 border-b border-input bg-transparent px-0 py-2 text-sm text-foreground",
        "placeholder:text-muted-foreground placeholder:italic placeholder:font-serif focus-visible:border-accent focus-visible:outline-none focus-visible:ring-0",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"

export { Textarea }
