import {
  getSettingsRequest,
  updateSettingsRequest,
  createAdminAccountRequest,
  listAdminsRequest,
  type SettingsDto,
} from "../lib/api"

export const settingsApiService = {
  getSettings: getSettingsRequest,
  updateSettings: (payload: Partial<Omit<SettingsDto, "_id">>) => updateSettingsRequest(payload),
  createAdmin: createAdminAccountRequest,
  listAdmins: listAdminsRequest,
}
