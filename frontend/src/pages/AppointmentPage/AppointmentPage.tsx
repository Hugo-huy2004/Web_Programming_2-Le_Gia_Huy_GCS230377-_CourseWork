import { useState } from "react"
import { useAppointmentStore } from "@/stores/useAppointmentStore"
import { APPOINTMENT_SERVICE_OPTIONS, APPOINTMENT_TIME_SLOTS } from "@/constants/appointmentOptions"

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
  const [statusMessage, setStatusMessage] = useState("")

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
      setStatusMessage(result.message)
      return
    }

    setStatusMessage("")
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
    <div className="max-w-7xl mx-auto py-10 md:py-20 animate-in fade-in duration-1000">
      
      {/* Header Section */}
      <header className="mb-20 space-y-8">
        <div className="flex items-center gap-4">
           <p className="small-caps text-accent text-[10px]">Private Curatorial Access</p>
           <div className="h-px flex-1 bg-border/40" />
        </div>
        <h1 className="font-serif text-5xl md:text-9xl text-foreground tracking-tighter leading-[0.85] italic">
          Bespoke <br /> Consultation
        </h1>
        <p className="max-w-2xl text-[16px] md:text-[18px] leading-relaxed text-muted-foreground font-serif italic">
          Enter our sanctuary for deep design exploration. We provide a private environment for bespoke material selection and heritage-centered advice at the Cong Hoa Garden Atelier.
        </p>
      </header>
 
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        {/* Left: Info Grid */}
        <aside className="lg:col-span-4 space-y-12">
          {[
            { id: "01", title: "Archive Availability", desc: "Monday — Saturday, 9 AM – 6 PM Local Time" },
            { id: "02", title: "Dedicated Session", desc: "Private 60-minute engagement with a specialist advisor" },
            { id: "03", title: "Registry Confirmation", desc: "Secure verification via your provided contact node" }
          ].map((item) => (
            <div key={item.id} className="group space-y-4">
              <span className="font-serif text-2xl italic text-accent opacity-30 group-hover:opacity-100 transition-opacity duration-500">{item.id}.</span>
              <div className="space-y-2">
                <p className="small-caps text-[10px] tracking-widest">{item.title}</p>
                <p className="text-sm text-muted-foreground font-serif italic leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
          
          <div className="pt-10 border-t border-border/40">
             <div className="p-8 bg-secondary/30 border border-border rounded-sm">
                <p className="small-caps text-[9px] text-accent mb-4">Haus Protocol</p>
                <p className="text-[11px] font-serif italic text-muted-foreground leading-relaxed">
                   "We believe time is the ultimate luxury. Every second of your consultation is focused on the orchestration of your legacy."
                </p>
             </div>
          </div>
        </aside>
 
        {/* Right: Booking Form */}
        <main className="lg:col-span-8">
          <form onSubmit={handleSubmit} className="p-8 md:p-14 bg-white border border-border rounded-sm shadow-sm space-y-12">
            
            <div className="space-y-10">
               <div>
                  <h3 className="font-serif text-2xl italic tracking-tight mb-2">Registry Manifest</h3>
                  <div className="h-px w-12 bg-accent/30" />
               </div>
 
               <div className="grid gap-10 md:grid-cols-2">
                  <div className="space-y-2 group">
                    <label className="small-caps text-[9px] text-muted-foreground group-focus-within:text-accent transition-colors">Legal Full Name *</label>
                    <input
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Hugo Wishpax"
                      className="w-full border-b border-border bg-transparent py-3 font-serif text-xl italic focus:border-accent outline-none transition-all placeholder:opacity-20"
                    />
                  </div>
 
                  <div className="space-y-2 group">
                    <label className="small-caps text-[9px] text-muted-foreground group-focus-within:text-accent transition-colors">Contact Number *</label>
                    <input
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+84 9XX XXX XXX"
                      className="w-full border-b border-border bg-transparent py-3 font-serif text-xl italic focus:border-accent outline-none transition-all placeholder:opacity-20"
                    />
                  </div>
 
                  <div className="space-y-2 group md:col-span-2">
                    <label className="small-caps text-[9px] text-muted-foreground group-focus-within:text-accent transition-colors">Digital Contact *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="curation@heritage.hwj"
                      className="w-full border-b border-border bg-transparent py-3 font-serif text-xl italic focus:border-accent outline-none transition-all placeholder:opacity-20"
                    />
                  </div>
               </div>
            </div>
 
            <div className="space-y-10">
               <div>
                  <h3 className="font-serif text-2xl italic tracking-tight mb-2">Orchestration Details</h3>
                  <div className="h-px w-12 bg-accent/30" />
               </div>
 
               <div className="grid gap-10 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="small-caps text-[9px] text-muted-foreground">Inquiry Classification</label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full border-b border-border bg-transparent py-3 font-serif text-lg italic focus:border-accent outline-none appearance-none cursor-pointer"
                    >
                      {APPOINTMENT_SERVICE_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
 
                  <div className="space-y-2">
                    <label className="small-caps text-[9px] text-muted-foreground">Preferred Archive Date *</label>
                    <input
                      type="date"
                      required
                      value={date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full border-b border-border bg-transparent py-3 font-serif text-lg focus:border-accent outline-none"
                    />
                  </div>
 
                  <div className="space-y-2">
                    <label className="small-caps text-[9px] text-muted-foreground">Time Window *</label>
                    <select
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full border-b border-border bg-transparent py-3 font-serif text-lg italic focus:border-accent outline-none appearance-none cursor-pointer"
                    >
                      <option value="">Select Opening Slot</option>
                      {APPOINTMENT_TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
               </div>
 
               <div className="space-y-3">
                  <label className="small-caps text-[9px] text-muted-foreground">Vision & Requirements</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your design vision or specific heritage requirements..."
                    className="w-full resize-none border-b border-border bg-transparent py-3 font-serif text-lg italic focus:border-accent outline-none transition-all placeholder:opacity-20"
                  />
               </div>
            </div>
 
            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-6 bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.24em] rounded-sm hover:bg-accent hover:text-white transition-all duration-700 shadow-sm"
              >
                Finalize Registry Request
              </button>
              {statusMessage && (
                <p className="text-[10px] text-destructive italic font-serif mt-6 text-center">{statusMessage}</p>
              )}
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
 
export default AppointmentPage
