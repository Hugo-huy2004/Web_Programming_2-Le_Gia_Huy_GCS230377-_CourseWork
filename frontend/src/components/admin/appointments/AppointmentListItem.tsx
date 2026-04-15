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
      className="group liquid-glass overflow-hidden rounded-sm border border-border transition-all duration-300 hover:border-accent hover:shadow-sm md:duration-500"
    >
      <div className="flex flex-col gap-3 p-2.5 md:gap-10 md:p-8 lg:flex-row lg:items-center">
        <div className="shrink-0 space-y-1 lg:w-72 lg:space-y-1.5 lg:border-r lg:border-border/40 lg:pr-10">
          <p className="text-[9px] font-medium uppercase tracking-[0.06em] text-muted-foreground/75 md:small-caps md:text-[8px] md:tracking-normal md:text-muted-foreground/40">Collector Registry</p>
          <h4 className="text-sm font-semibold tracking-tight text-foreground md:font-serif md:text-xl md:italic">{appointment.fullName}</h4>
          <div className="flex flex-col gap-0.5 text-[9px] text-muted-foreground/75 md:gap-1 md:text-[10px] md:font-medium md:text-muted-foreground/60">
            <span className="w-fit border-b border-border/20 break-all">{appointment.email}</span>
            <span>{appointment.phone}</span>
          </div>
        </div>

        <div className="flex-1 space-y-2 md:space-y-6">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-8">
            <div className="space-y-1.5 md:space-y-2">
              <p className="text-[9px] font-medium uppercase tracking-[0.06em] text-accent md:small-caps md:text-[8px] md:tracking-normal">Inquiry Focus</p>
              <p className="text-xs font-semibold text-foreground md:font-serif md:text-lg md:italic">{appointment.service}</p>
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <p className="text-[9px] font-medium uppercase tracking-[0.06em] text-muted-foreground/75 md:small-caps md:text-[8px] md:tracking-normal md:text-muted-foreground/40">Orchestration Slot</p>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                <p className="text-xs font-semibold text-foreground md:font-serif md:text-lg md:italic">
                  {appointment.date} <span className="mx-1.5 text-muted-foreground/20 md:mx-2">|</span> {appointment.time}
                </p>
              </div>
            </div>
          </div>

          {appointment.note && (
            <div className="liquid-glass rounded-sm border-l-2 border-accent p-2.5 md:p-5">
              <p className="mb-1 text-[9px] font-medium uppercase tracking-[0.06em] text-accent md:small-caps md:mb-2 md:text-[8px] md:tracking-normal">Registry Manifest</p>
              <p className="text-[11px] leading-relaxed text-muted-foreground/85 md:font-serif md:text-[13px] md:italic md:text-muted-foreground">
                "{appointment.note}"
              </p>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2.5 md:gap-6 lg:w-64 lg:border-l lg:border-border/40 lg:pl-10">
          <div className="space-y-1.5 md:space-y-2">
            <label className="text-[9px] font-medium uppercase tracking-[0.06em] text-muted-foreground/75 md:small-caps md:text-[8px] md:tracking-normal md:text-muted-foreground/40">Status Registry</label>
            <div className="flex flex-wrap gap-1 md:hidden">
              {statusOptions.map((item) => {
                const isActive = item === appointment.status
                return (
                  <button
                    key={item}
                    onClick={() => onUpdateStatus(appointment.id, item)}
                    className={`rounded-sm border px-1.5 py-1 text-[9px] font-semibold uppercase tracking-[0.05em] leading-none transition-colors ${
                      isActive
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                    }`}
                  >
                    {item}
                  </button>
                )
              })}
            </div>
            <div className="relative hidden md:block">
              <select
                value={appointment.status}
                onChange={(event) => onUpdateStatus(appointment.id, event.target.value as AppointmentStatus)}
                className={`w-full cursor-pointer appearance-none border-b border-border bg-transparent py-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] outline-none transition-colors md:py-2 md:font-serif md:text-[13px] md:font-bold md:tracking-widest ${
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
            className="w-fit self-end rounded-sm border border-destructive/20 px-2.5 py-1 text-right text-[9px] font-medium uppercase tracking-[0.06em] text-destructive/70 transition-colors duration-300 hover:border-destructive/40 hover:text-destructive md:border-0 md:px-0 md:py-0 md:small-caps md:text-[9px] md:tracking-normal md:text-destructive/40 md:duration-500"
          >
            Purge Record
          </button>
        </div>
      </div>
    </motion.div>
  )
}
