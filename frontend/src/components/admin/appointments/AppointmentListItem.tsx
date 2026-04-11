import { motion } from "framer-motion"
import type { Appointment, AppointmentStatus } from "@/types/store"

type AppointmentListItemProps = {
  appointment: Appointment
  index: number
  statusOptions: readonly AppointmentStatus[]
  onUpdateStatus: (appointmentId: string, status: AppointmentStatus) => Promise<void> | void
  onDelete: (appointmentId: string) => Promise<void> | void
}

export function AppointmentListItem({
  appointment,
  index,
  statusOptions,
  onUpdateStatus,
  onDelete,
}: AppointmentListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      className="group overflow-hidden rounded-sm border border-border bg-white transition-all duration-500 hover:border-accent hover:shadow-sm"
    >
      <div className="flex flex-col gap-10 p-8 lg:flex-row lg:items-center">
        <div className="shrink-0 space-y-2 lg:w-72 lg:border-r lg:border-border/40 lg:pr-10">
          <p className="small-caps text-[8px] text-muted-foreground/40">Collector Registry</p>
          <h4 className="font-serif text-xl italic tracking-tight text-foreground">{appointment.fullName}</h4>
          <div className="flex flex-col gap-1 text-[10px] font-medium text-muted-foreground/60">
            <span className="w-fit border-b border-border/20">{appointment.email}</span>
            <span>{appointment.phone}</span>
          </div>
        </div>

        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <p className="small-caps text-[8px] text-accent">Inquiry Focus</p>
              <p className="font-serif text-lg italic text-foreground">{appointment.service}</p>
            </div>
            <div className="space-y-2">
              <p className="small-caps text-[8px] text-muted-foreground/40">Orchestration Slot</p>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                <p className="font-serif text-lg italic text-foreground">
                  {appointment.date} <span className="mx-2 text-muted-foreground/20">|</span> {appointment.time}
                </p>
              </div>
            </div>
          </div>

          {appointment.note && (
            <div className="rounded-sm border-l-2 border-accent bg-secondary/20 p-5">
              <p className="small-caps mb-2 text-[8px] text-accent">Registry Manifest</p>
              <p className="font-serif text-[13px] italic leading-relaxed text-muted-foreground">
                "{appointment.note}"
              </p>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-6 lg:w-64 lg:border-l lg:border-border/40 lg:pl-10">
          <div className="space-y-2">
            <label className="small-caps text-[8px] text-muted-foreground/40">Status Registry</label>
            <div className="relative">
              <select
                value={appointment.status}
                onChange={(event) => onUpdateStatus(appointment.id, event.target.value as AppointmentStatus)}
                className={`w-full cursor-pointer appearance-none border-b border-border bg-transparent py-2 font-serif text-[13px] font-bold uppercase tracking-widest outline-none transition-colors ${
                  appointment.status === "confirmed"
                    ? "border-accent text-accent"
                    : appointment.status === "cancelled"
                      ? "text-destructive"
                      : "text-foreground"
                }`}
              >
                {statusOptions.map((item) => (
                  <option key={item} value={item}>
                    {item.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[8px] opacity-20">▼</div>
            </div>
          </div>

          <button
            onClick={() => onDelete(appointment.id)}
            className="small-caps w-fit self-end text-right text-[9px] text-destructive/40 transition-colors duration-500 hover:text-destructive"
          >
            Purge Record
          </button>
        </div>
      </div>
    </motion.div>
  )
}
