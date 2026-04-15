import { useEffect } from "react"
import { useAppointmentStore } from "@/stores/useAppointmentStore"
import { AdminEmptyState } from "@/components/admin/AdminEmptyState"
import { AppointmentListItem } from "@/components/admin/appointments/AppointmentListItem"
import { APPOINTMENT_STATUS_OPTIONS } from "@/constants/statusOptions"
import { confirmWithToast } from "@/lib/toastConfirm"
import { toast } from "sonner"
 
const AppointmentTab = () => {
  const { appointments, updateAppointmentStatus, fetchAppointments, deleteAppointment } = useAppointmentStore()
 
  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const handleUpdateAppointmentStatus = async (appointmentId: string, status: (typeof APPOINTMENT_STATUS_OPTIONS)[number]) => {
    const result = await updateAppointmentStatus(appointmentId, status)
    if (result.ok) {
      toast.success(`Appointment status updated to ${status}.`)
      return
    }

    toast.error(result.message || "Failed to update appointment status.")
  }
 
  return (
    <div className="animate-in fade-in space-y-3 duration-500 md:space-y-10 md:duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-2 border-b border-border/70 pb-3 md:flex-row md:items-end md:gap-6 md:border-border md:pb-8">
        <div className="space-y-1.5 md:space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-accent md:small-caps">Consultation Orchestration</p>
          <h2 className="text-lg font-semibold tracking-tight text-foreground md:font-serif md:text-5xl md:italic md:tracking-tighter">Archive Registry</h2>
        </div>
        <div className="rounded-sm border border-border/70 bg-secondary/40 px-3 py-2 md:border-border md:bg-secondary/50 md:p-4">
           <p className="mr-2 inline-block text-[9px] font-medium uppercase tracking-[0.06em] text-muted-foreground/80 md:small-caps md:text-[9px] md:tracking-normal md:text-muted-foreground">Global Volume</p>
           <span className="text-xs font-semibold text-foreground md:font-serif md:text-xl md:italic">{appointments.length} Consultations</span>
        </div>
      </div>
 
      {/* Appointments List */}
      <div className="space-y-2.5 md:space-y-4">
        {appointments.map((appointment, idx) => (
          <AppointmentListItem
            key={appointment.id}
            appointment={appointment}
            index={idx}
            statusOptions={APPOINTMENT_STATUS_OPTIONS}
            onUpdateStatus={(appointmentId, status) => void handleUpdateAppointmentStatus(appointmentId, status)}
            onDelete={async (appointmentId) => {
              confirmWithToast({
                message: "Permanently purge this consultation record?",
                confirmLabel: "Purge",
                onConfirm: async () => {
                  const result = await deleteAppointment(appointmentId)
                  if (result.ok) {
                    toast.success("Consultation record purged.")
                    return
                  }
                  toast.error(result.message || "Failed to purge consultation record.")
                },
              })
            }}
          />
        ))}
 
        {appointments.length === 0 && (
          <AdminEmptyState message="Registry remains empty. No consultations currently orchestrated in the heritage archive." />
        )}
      </div>
    </div>
  )
}
 
export default AppointmentTab
