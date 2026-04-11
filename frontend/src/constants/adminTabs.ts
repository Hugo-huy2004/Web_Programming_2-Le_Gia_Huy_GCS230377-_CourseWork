export type AdminTabId =
  | "products"
  | "orders"
  | "appointments"
  | "customers"
  | "settings"
  | "supportTickets"

export type AdminTabIconName = "archive" | "clipboard" | "calendar" | "help" | "users" | "settings"

export const ADMIN_TAB_DEFINITIONS: ReadonlyArray<{
  id: AdminTabId
  label: string
  iconName: AdminTabIconName
  countKey?: "pendingOrders" | "newAppointments" | "unresolvedSupport"
}> = [
  { id: "products", label: "Collections", iconName: "archive" },
  { id: "orders", label: "Acquisitions", iconName: "clipboard", countKey: "pendingOrders" },
  { id: "appointments", label: "Consultations", iconName: "calendar", countKey: "newAppointments" },
  { id: "supportTickets", label: "Concierge Inquiries", iconName: "help", countKey: "unresolvedSupport" },
  { id: "customers", label: "Relations", iconName: "users" },
  { id: "settings", label: "Governance", iconName: "settings" },
]
