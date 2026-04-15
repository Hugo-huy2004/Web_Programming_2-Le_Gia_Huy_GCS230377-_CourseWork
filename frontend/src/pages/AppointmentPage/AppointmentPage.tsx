import { useState } from "react"
import { useAppointmentStore } from "@/stores/useAppointmentStore"
import { APPOINTMENT_SERVICE_OPTIONS, APPOINTMENT_TIME_SLOTS } from "@/constants/appointmentOptions"
import { toast } from "sonner"

const AppointmentPage = () => {
  const { addAppointment } = useAppointmentStore()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [service, setService] = useState<string>(APPOINTMENT_SERVICE_OPTIONS[0])
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const resetForm = () => {
    setFullName("")
    setEmail("")
    setPhone("")
    setDate("")
    setTime("")
    setService(APPOINTMENT_SERVICE_OPTIONS[0])
    setMessage("")
    setSubmitted(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !phone.trim() || !date || !time) return

    const result = await addAppointment({
      fullName,
      email,
      phone,
      date,
      time,
      service,
      note: message,
    })

    if (!result.ok) {
      toast.error(result.message || "Could not submit appointment request.")
      return
    }

    toast.success("Appointment request submitted successfully.")
    setSubmitted(true)
  }
 
  if (submitted) {
    return (
      <section className="mx-auto max-w-2xl space-y-12 py-24 text-center animate-in fade-in duration-1000">
        <div className="space-y-4">
          <p className="small-caps text-accent">Registration Complete</p>
          <h1 className="font-serif text-5xl md:text-7xl leading-tight text-foreground tracking-tighter italic">
            Consultation <br /> Reserved
          </h1>
          <div className="h-px w-16 bg-border mx-auto mt-6" />
        </div>
 
        <div className="space-y-6 text-muted-foreground font-serif italic text-lg leading-relaxed px-6">
          <p>
            Greetings, <strong>{fullName}</strong>. We have successfully registered your request for{" "}
            <span className="text-foreground">{service}</span> on <span className="text-foreground">{date}</span> at <span className="text-foreground">{time}</span>.
          </p>
          <p className="text-sm tracking-tight opacity-60">
            A house representative will contact you via <span className="border-b border-border/40">{email}</span> to finalize the orchestration of your visit.
          </p>
        </div>
 
        <button
          onClick={resetForm}
          className="px-12 py-5 bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.24em] rounded-sm hover:bg-accent hover:text-white transition-all duration-700 shadow-sm"
        >
          Schedule New Session
        </button>
      </section>
    )
  }
 
  return (
    <div className="mx-auto max-w-7xl animate-in fade-in py-6 duration-700 md:py-20 md:duration-1000">
      
      {/* Header Section */}
      <header className="mb-8 space-y-4 md:mb-20 md:space-y-8">
        <div className="flex items-center gap-3 md:gap-4">
           <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-accent md:small-caps">Private Curatorial Access</p>
           <div className="h-px flex-1 bg-border/40" />
        </div>
        <h1 className="text-3xl font-semibold leading-[0.92] tracking-tight text-foreground md:font-serif md:text-9xl md:italic md:tracking-tighter md:leading-[0.85]">
          Bespoke <br /> Consultation
        </h1>
        <p className="max-w-2xl text-[13px] leading-relaxed text-muted-foreground/85 md:text-[18px] md:font-serif md:italic md:text-muted-foreground">
          Enter our sanctuary for deep design exploration. We provide a private environment for bespoke material selection and heritage-centered advice at the Cong Hoa Garden Atelier.
        </p>
      </header>
 
      <div className="grid grid-cols-1 gap-5 md:gap-20 lg:grid-cols-12">
        
        {/* Left: Info Grid */}
        <aside className="space-y-4 lg:col-span-4 md:space-y-12">
          {[
            { id: "01", title: "Archive Availability", desc: "Monday — Saturday, 9 AM – 6 PM Local Time" },
            { id: "02", title: "Dedicated Session", desc: "Private 60-minute engagement with a specialist advisor" },
            { id: "03", title: "Registry Confirmation", desc: "Secure verification via your provided contact node" }
          ].map((item) => (
            <div key={item.id} className="group space-y-1.5 md:space-y-4">
              <span className="text-base font-semibold text-accent/60 transition-opacity duration-300 group-hover:opacity-100 md:font-serif md:text-2xl md:italic md:text-accent md:opacity-30 md:duration-500">{item.id}.</span>
              <div className="space-y-1 md:space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] md:small-caps md:tracking-widest">{item.title}</p>
                <p className="text-[12px] leading-relaxed text-muted-foreground/85 md:text-sm md:font-serif md:italic md:text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
          
          <div className="border-t border-border/40 pt-4 md:pt-10">
             <div className="rounded-sm border border-border bg-secondary/30 p-3 md:p-8">
                <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.08em] text-accent md:mb-4 md:small-caps">Haus Protocol</p>
                <p className="text-[10px] leading-relaxed text-muted-foreground/85 md:text-[11px] md:font-serif md:italic md:text-muted-foreground">
                   "We believe time is the ultimate luxury. Every second of your consultation is focused on the orchestration of your legacy."
                </p>
             </div>
          </div>
        </aside>
 
        {/* Right: Booking Form */}
        <main className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="space-y-5 rounded-sm border border-border bg-white p-3 shadow-sm md:space-y-12 md:p-14">
            
            <div className="space-y-4 md:space-y-10">
               <div>
                  <h3 className="mb-1 text-base font-semibold tracking-tight text-foreground md:mb-2 md:font-serif md:text-2xl md:italic">Registry Manifest</h3>
                  <div className="h-px w-8 bg-accent/30 md:w-12" />
               </div>
 
               <div className="grid gap-3 md:grid-cols-2 md:gap-10">
                  <div className="group space-y-1.5 md:space-y-2">
                    <label className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground/80 transition-colors group-focus-within:text-accent md:small-caps md:text-[9px] md:tracking-normal md:text-muted-foreground">Legal Full Name *</label>
                    <input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Hugo Wishpax"
                      className="h-10 w-full rounded-sm border border-border bg-background px-3 text-sm text-foreground outline-none transition-all duration-300 placeholder:opacity-40 focus:border-accent md:h-auto md:border-0 md:border-b md:bg-transparent md:px-0 md:py-3 md:font-serif md:text-xl md:italic md:placeholder:opacity-20"
                    />
                  </div>
 
                  <div className="group space-y-1.5 md:space-y-2">
                    <label className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground/80 transition-colors group-focus-within:text-accent md:small-caps md:text-[9px] md:tracking-normal md:text-muted-foreground">Contact Number *</label>
                    <input
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+84 9XX XXX XXX"
                      className="h-10 w-full rounded-sm border border-border bg-background px-3 text-sm text-foreground outline-none transition-all duration-300 placeholder:opacity-40 focus:border-accent md:h-auto md:border-0 md:border-b md:bg-transparent md:px-0 md:py-3 md:font-serif md:text-xl md:italic md:placeholder:opacity-20"
                    />
                  </div>
 
                  <div className="group space-y-1.5 md:col-span-2 md:space-y-2">
                    <label className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground/80 transition-colors group-focus-within:text-accent md:small-caps md:text-[9px] md:tracking-normal md:text-muted-foreground">Digital Contact *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="curation@heritage.hwj"
                      className="h-10 w-full rounded-sm border border-border bg-background px-3 text-sm text-foreground outline-none transition-all duration-300 placeholder:opacity-40 focus:border-accent md:h-auto md:border-0 md:border-b md:bg-transparent md:px-0 md:py-3 md:font-serif md:text-xl md:italic md:placeholder:opacity-20"
                    />
                  </div>
               </div>
            </div>
 
            <div className="space-y-4 md:space-y-10">
               <div>
                  <h3 className="mb-1 text-base font-semibold tracking-tight text-foreground md:mb-2 md:font-serif md:text-2xl md:italic">Orchestration Details</h3>
                  <div className="h-px w-8 bg-accent/30 md:w-12" />
               </div>
 
               <div className="grid gap-3 md:grid-cols-2 md:gap-10">
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground/80 md:small-caps md:text-[9px] md:tracking-normal md:text-muted-foreground">Inquiry Classification</label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="h-10 w-full rounded-sm border border-border bg-background px-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-accent md:h-auto md:border-0 md:border-b md:bg-transparent md:px-0 md:py-3 md:font-serif md:text-lg md:italic"
                    >
                      {APPOINTMENT_SERVICE_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
 
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground/80 md:small-caps md:text-[9px] md:tracking-normal md:text-muted-foreground">Preferred Archive Date *</label>
                    <input
                      type="date"
                      required
                      value={date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-10 w-full rounded-sm border border-border bg-background px-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-accent md:h-auto md:border-0 md:border-b md:bg-transparent md:px-0 md:py-3 md:font-serif md:text-lg"
                    />
                  </div>
 
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground/80 md:small-caps md:text-[9px] md:tracking-normal md:text-muted-foreground">Time Window *</label>
                    <select
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="h-10 w-full rounded-sm border border-border bg-background px-3 text-sm text-foreground outline-none transition-all duration-300 focus:border-accent md:h-auto md:border-0 md:border-b md:bg-transparent md:px-0 md:py-3 md:font-serif md:text-lg md:italic"
                    >
                      <option value="">Select Opening Slot</option>
                      {APPOINTMENT_TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
               </div>
 
               <div className="space-y-1.5 md:space-y-3">
                  <label className="text-[10px] font-medium uppercase tracking-[0.06em] text-muted-foreground/80 md:small-caps md:text-[9px] md:tracking-normal md:text-muted-foreground">Vision & Requirements</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your design vision or specific heritage requirements..."
                    className="min-h-[88px] w-full resize-none rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all duration-300 placeholder:opacity-40 focus:border-accent md:min-h-0 md:border-0 md:border-b md:bg-transparent md:px-0 md:py-3 md:font-serif md:text-lg md:italic md:placeholder:opacity-20"
                  />
               </div>
            </div>
 
            <div className="pt-1 md:pt-6">
              <button
                type="submit"
                className="h-11 w-full rounded-sm bg-foreground px-4 text-[10px] font-semibold uppercase tracking-[0.08em] text-background transition-all duration-300 hover:bg-accent hover:text-white md:h-auto md:py-6 md:text-[11px] md:font-bold md:tracking-[0.24em] md:duration-700"
              >
                Finalize Registry Request
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
 
export default AppointmentPage
