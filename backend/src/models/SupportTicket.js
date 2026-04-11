import mongoose from 'mongoose'
import { SUPPORT_TICKET_STATUSES } from '../constants/statuses.js'

const supportTicketSchema = new mongoose.Schema(
  {
    customerEmail: { type: String, required: true, lowercase: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: SUPPORT_TICKET_STATUSES,
      default: SUPPORT_TICKET_STATUSES[0],
    },
  },
  { timestamps: true }
)

supportTicketSchema.index({ customerEmail: 1, createdAt: -1 })

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema)

export default SupportTicket
