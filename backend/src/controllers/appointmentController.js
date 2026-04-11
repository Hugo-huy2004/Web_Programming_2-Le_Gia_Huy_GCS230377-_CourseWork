import Appointment from '../models/Appointment.js';
import { sendError, sendSuccess } from '../lib/responseHelpers.js';
import { APPOINTMENT_STATUSES } from '../constants/statuses.js';

export const createAppointment = async (req, res) => {
    try {
        const { fullName, email, phone, date, time, service, note } = req.body;
        if (!fullName || !email || !phone || !date || !time || !service) {
            return sendError(res, 400, 'Please provide all required fields');
        }
        const appointment = new Appointment({
            fullName,
            email,
            phone,
            date,
            time,
            service,
            note: note || "",
        });
        await appointment.save();
        return sendSuccess(res, 201, { message: 'Appointment booked successfully', appointment });
    } catch (error) {
        console.error("Error creating appointment:", error);
        return sendError(res, 500, 'Failed to book appointment');
    }
};

export const listAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ createdAt: -1 });
        return sendSuccess(res, 200, { appointments });
    } catch (error) {
        console.error("Error listing appointments:", error);
        return sendError(res, 500, 'Failed to fetch appointments');
    }
};

export const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!APPOINTMENT_STATUSES.includes(status)) {
            return sendError(res, 400, 'Invalid status');
        }
        const appointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Return the updated object instead of the original one
        );

        if (!appointment) {
            return sendError(res, 404, 'Appointment not found');
        }

        return sendSuccess(res, 200, { message: 'Appointment status updated', appointment });
    } catch (error) {
        console.error("Error updating appointment status:", error);
        return sendError(res, 500, 'Failed to update appointment status');
    }
};

export const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAppointment = await Appointment.findByIdAndDelete(id);

        if (!deletedAppointment) {
            return sendError(res, 404, 'Appointment not found');
        }

        return sendSuccess(res, 200, { message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error("Error deleting appointment:", error);
        return sendError(res, 500, 'Failed to delete appointment');
    }
};
