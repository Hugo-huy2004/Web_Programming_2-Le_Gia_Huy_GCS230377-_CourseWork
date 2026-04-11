import { create } from 'zustand'
import type { Appointment, AppointmentStatus } from '../types/store'
import { mapAppointmentDto } from '../lib/storeUtils'
import { appointmentApiService } from '../services/appointmentApiService'

interface AppointmentStoreState {
  appointments: Appointment[]
  
  setAppointments: (appointments: Appointment[]) => void
  fetchAppointments: () => Promise<void>
  addAppointment: (input: {
    fullName: string
    email: string
    phone: string
    date: string
    time: string
    service: string
    note?: string
  }) => Promise<{ ok: boolean; message: string; appointmentId?: string }>
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => Promise<void>
  deleteAppointment: (appointmentId: string) => Promise<{ ok: boolean; message: string }>
  newAppointmentCount: () => number
}

export const useAppointmentStore = create<AppointmentStoreState>((set, get) => ({
  appointments: [],

  setAppointments: (appointments: Appointment[]) => {
    set({ appointments })
  },

  fetchAppointments: async () => {
    try {
      const result = await appointmentApiService.list()
      set({
        appointments: result.appointments.map(mapAppointmentDto),
      })
    } catch (error) {
      console.error('[appointments-sync-failed]', error)
    }
  },

  addAppointment: async (input) => {
    try {
      const result = await appointmentApiService.create(input)
      const mapped = mapAppointmentDto(result.appointment)
      set({
        appointments: [mapped, ...get().appointments],
      })

      return {
        ok: true,
        message: result.message,
        appointmentId: result.appointment._id,
      }
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Failed to book appointment.',
      }
    }
  },

  updateAppointmentStatus: async (appointmentId: string, status: AppointmentStatus) => {
    try {
      const result = await appointmentApiService.updateStatus(appointmentId, status)
      const updated = mapAppointmentDto(result.appointment)
      set({
        appointments: get().appointments.map((appointment) =>
          appointment.id === appointmentId ? updated : appointment
        ),
      })
    } catch (error) {
      console.error('[appointment-status-update-failed]', error)
    }
  },

  newAppointmentCount: () => {
    return get().appointments.filter((appointment) => appointment.status === 'new').length
  },

  deleteAppointment: async (appointmentId: string) => {
    try {
      const result = await appointmentApiService.remove(appointmentId)
      set({
        appointments: get().appointments.filter((a) => a.id !== appointmentId),
      })
      return { ok: true, message: result.message }
    } catch (error) {
      console.error('[appointment-delete-failed]', error)
      return {
        ok: false,
        message: error instanceof Error ? error.message : 'Failed to delete appointment',
      }
    }
  },
}))
