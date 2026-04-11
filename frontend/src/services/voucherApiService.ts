import {
  listVouchersRequest,
  createVoucherRequest,
  toggleVoucherStatusRequest,
  deleteVoucherRequest,
} from "../lib/api"

export const voucherApiService = {
  list: listVouchersRequest,
  create: createVoucherRequest,
  toggleStatus: toggleVoucherStatusRequest,
  remove: deleteVoucherRequest,
}
