import { CustomerConciergeTab } from "@/components/customer/tabs/CustomerConciergeTab"
import { useState } from "react"
import { toast } from "sonner"
import { useAppStore } from "@/stores/useAppStore"
import { useCustomerStore } from "@/stores/useCustomerStore"

export function ConciergeTab() {
  const [message, setMessage] = useState("")
  const { addSupportTicket } = useAppStore()
  const { activeCustomerEmail } = useCustomerStore()

  const submitInquiry = async () => {
    if (!activeCustomerEmail) {
      toast.error("Identity verification required.")
      return
    }
    if (!message.trim()) {
      toast.error("Please provide inquiry details.")
      return
    }

    const result = await addSupportTicket(activeCustomerEmail, message)
    if (result.ok) {
      setMessage("")
      toast.success("Inquiry dispatched to support database.")
      return
    }

    toast.error(result.message || "Failed to dispatch inquiry.")
  }

  return (
    <CustomerConciergeTab
      message={message}
      onMessageChange={setMessage}
      onSubmitInquiry={submitInquiry}
    />
  )
}
