import {
  updateCustomerProfileRequest,
  updateCustomerMetricsRequest,
  listCustomersRequest,
  type CustomerDto,
} from "../lib/api"

export type { CustomerDto }

export const customerApiService = {
  list: listCustomersRequest,
  updateProfile: updateCustomerProfileRequest,
  updateMetrics: updateCustomerMetricsRequest,
}
