import SupportTicket from '../models/SupportTicket.js'
import { sendError, sendSuccess } from '../lib/responseHelpers.js'
import { SUPPORT_TICKET_STATUSES } from '../constants/statuses.js'

function toTrimmedText(value) {
  return String(value ?? "").trim()
}

function normalizeEmail(email) {
  return toTrimmedText(email).toLowerCase()
}

export const createSupportTicket = async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email)
    const message = toTrimmedText(req.body?.message)

    if (!email || !message) {
      return sendError(res, 400, 'Email and message are required.')
    }

    const ticket = await SupportTicket.create({
      customerEmail: email,
      message,
      status: 'open',
    })

    return sendSuccess(res, 201, {
      message: 'Inquiry submitted successfully.',
      ticket,
    })
  } catch (err) {
    console.error('Create Support Ticket Failed:', err)
    return sendError(res, 500, 'Failed to submit inquiry.')
  }
}

export const listSupportTickets = async (_req, res) => {
  try {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 })
    return sendSuccess(res, 200, { tickets })
  } catch (err) {
    console.error('Fetch Support Tickets Failed:', err)
    return sendError(res, 500, 'Could not fetch support tickets.')
  }
}

export const updateSupportTicketStatus = async (req, res) => {
  try {
    const id = toTrimmedText(req.params?.id)
    const status = toTrimmedText(req.body?.status).toLowerCase()

    if (!SUPPORT_TICKET_STATUSES.includes(status)) {
      return sendError(res, 400, 'Invalid support status.')
    }

    const ticket = await SupportTicket.findByIdAndUpdate(id, { status }, { new: true })

    if (!ticket) {
      return sendError(res, 404, 'Support ticket not found.')
    }

    return sendSuccess(res, 200, { message: 'Support status updated.', ticket })
  } catch (err) {
    console.error('Update Support Ticket Status Failed:', err)
    return sendError(res, 500, 'Could not update support ticket status.')
  }
}

export const deleteSupportTicket = async (req, res) => {
  try {
    const id = toTrimmedText(req.params?.id)
    const deleted = await SupportTicket.findByIdAndDelete(id)

    if (!deleted) {
      return sendError(res, 404, 'Support ticket not found.')
    }

    return sendSuccess(res, 200, { message: 'Support ticket deleted.' })
  } catch (err) {
    console.error('Delete Support Ticket Failed:', err)
    return sendError(res, 500, 'Could not delete support ticket.')
  }
}
