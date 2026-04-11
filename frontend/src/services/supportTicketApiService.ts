import {
  listSupportTicketsRequest,
  createSupportTicketRequest,
  updateSupportTicketStatusRequest,
  deleteSupportTicketRequest,
  type SupportStatus,
} from "../lib/api"

export const supportTicketApiService = {
  list: listSupportTicketsRequest,
  create: createSupportTicketRequest,
  updateStatus: (id: string, status: SupportStatus) => updateSupportTicketStatusRequest(id, status),
  remove: deleteSupportTicketRequest,
}
