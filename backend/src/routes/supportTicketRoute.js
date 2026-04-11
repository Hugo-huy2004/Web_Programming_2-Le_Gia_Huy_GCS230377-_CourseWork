import express from 'express'
import {
  createSupportTicket,
  listSupportTickets,
  updateSupportTicketStatus,
  deleteSupportTicket,
} from '../controllers/supportTicketController.js'
import { requireAdminApiKey } from '../middlewares/adminKeyMiddleware.js'

const router = express.Router()

router.post('/', createSupportTicket)
router.get('/', requireAdminApiKey, listSupportTickets)
router.patch('/:id/status', requireAdminApiKey, updateSupportTicketStatus)
router.delete('/:id', requireAdminApiKey, deleteSupportTicket)

export default router
