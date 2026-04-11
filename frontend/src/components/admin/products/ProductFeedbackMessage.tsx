import { AnimatePresence, motion } from "framer-motion"
import { Check, X } from "lucide-react"

type ProductFeedbackMessageProps = {
  message: string
  onClear: () => void
}

export function ProductFeedbackMessage({ message, onClear }: ProductFeedbackMessageProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex items-center gap-3 border border-accent/20 bg-accent/5 p-4 font-serif text-[12px] italic text-accent"
        >
          <Check className="h-4 w-4" />
          {message}
          <button onClick={onClear} className="ml-auto opacity-40 transition-opacity hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
