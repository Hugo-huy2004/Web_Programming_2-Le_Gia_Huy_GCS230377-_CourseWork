import {
  createAppointmentRequest,
  listAppointmentsRequest,
  updateAppointmentStatusRequest,
  deleteAppointmentRequest,
} from "../lib/api"

export const appointmentApiService = {
  create: createAppointmentRequest,
  list: listAppointmentsRequest,
  updateStatus: updateAppointmentStatusRequest,
  remove: deleteAppointmentRequest,
}
