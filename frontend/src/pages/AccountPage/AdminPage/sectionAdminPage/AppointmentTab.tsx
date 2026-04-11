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
 
  return (
    <div className="animate-in fade-in duration-700 space-y-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border">
        <div className="space-y-2">
          <p className="small-caps text-accent text-[10px]">Consultation Orchestration</p>
          <h2 className="font-serif text-3xl md:text-5xl text-foreground tracking-tighter italic">Archive Registry</h2>
        </div>
        <div className="p-4 bg-secondary/50 rounded-sm border border-border">
           <p className="small-caps text-[9px] text-muted-foreground mr-10 inline-block">Global Volume</p>
           <span className="font-serif italic text-xl text-foreground">{appointments.length} Consultations</span>
        </div>
      </div>
 
      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.map((appointment, idx) => (
          <AppointmentListItem
            key={appointment.id}
            appointment={appointment}
            index={idx}
            statusOptions={APPOINTMENT_STATUS_OPTIONS}
            onUpdateStatus={(appointmentId, status) => updateAppointmentStatus(appointmentId, status)}
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
