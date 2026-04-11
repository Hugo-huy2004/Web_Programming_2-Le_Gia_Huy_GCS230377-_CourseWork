import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useCustomerStore } from "@/stores/useCustomerStore"

export default function CustomerProfileRequiredForm() {
  const { activeCustomer, updateCustomerProfile, customerLogout } = useCustomerStore()

  const [fullName, setFullName] = useState("")
  const [birthday, setBirthday] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!activeCustomer) return

    setFullName(activeCustomer.profile.fullName ?? "")
    setBirthday(activeCustomer.profile.birthday ?? "")
    setPhone(activeCustomer.profile.phone ?? "")
    setAddress(activeCustomer.profile.address ?? "")
  }, [activeCustomer])

  const submitProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!fullName.trim() || !birthday || !phone.trim() || !address.trim()) {
      toast.error("Please fill all required profile fields.")
      return
    }

    setSubmitting(true)
    try {
      const result = await updateCustomerProfile({
        fullName,
        birthday,
        phone,
        address,
      })

      if (!result.ok) {
        toast.error(result.message || "Failed to save profile.")
        return
      }

      toast.success("Profile completed. You can now use cart and checkout.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-background/35 px-4 py-6 backdrop-blur-md md:px-8">
      <section className="w-full max-w-xl space-y-6 rounded-sm border border-border bg-white p-5 shadow-editorial md:p-7">
        <header className="space-y-2 border-b border-border pb-4">
          <p className="small-caps text-accent">One-Time Member Setup</p>
          <h1 className="font-serif text-2xl italic tracking-tight text-foreground md:text-3xl">
            Complete Your Identity Registry
          </h1>
          <p className="font-serif text-xs italic leading-relaxed text-muted-foreground md:text-sm">
            Please complete profile details to unlock cart and checkout.
          </p>
        </header>

        <form onSubmit={submitProfile} className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="small-caps text-[10px] text-muted-foreground">Full Name *</label>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="e.g. Hugo Wishpax"
              className="w-full rounded-sm border border-border bg-transparent px-3 py-2 font-serif text-base italic outline-none transition-colors focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="small-caps text-[10px] text-muted-foreground">Birthday *</label>
            <input
              type="date"
              value={birthday}
              onChange={(event) => setBirthday(event.target.value)}
              className="w-full rounded-sm border border-border bg-transparent px-3 py-2 font-serif text-sm outline-none transition-colors focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="small-caps text-[10px] text-muted-foreground">Phone *</label>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+84 ..."
              className="w-full rounded-sm border border-border bg-transparent px-3 py-2 font-serif text-base italic outline-none transition-colors focus:border-accent"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="small-caps text-[10px] text-muted-foreground">Address *</label>
            <textarea
              rows={2}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              placeholder="Your current address"
              className="w-full resize-none rounded-sm border border-border bg-transparent px-3 py-2 font-serif text-sm italic outline-none transition-colors focus:border-accent"
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3 md:col-span-2">
            <button
              type="button"
              onClick={customerLogout}
              className="rounded-sm border border-border px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-destructive"
            >
              Logout
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-sm bg-foreground px-5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-background transition-colors hover:bg-accent disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save And Continue"}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
