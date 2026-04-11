import mongoose from 'mongoose'
import { APPOINTMENT_STATUSES } from '../constants/statuses.js'

const appointmentSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    service: { type: String, required: true, trim: true },
    note: { type: String, default: "", trim: true },
    status: {
        type: String,
        enum: APPOINTMENT_STATUSES,
        default: APPOINTMENT_STATUSES[0],
    },
},{ timestamps: true })

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment