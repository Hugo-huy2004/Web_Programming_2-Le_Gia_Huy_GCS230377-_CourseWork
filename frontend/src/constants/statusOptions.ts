import type { AppointmentStatus, OrderStatus, SupportStatus } from "@/types/store"

export const ORDER_STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "shipping",
  "delivered",
  "cancelled",
] as const satisfies readonly OrderStatus[]

export const ORDER_STATUS_UI_CONFIG: Record<
  OrderStatus,
  { colorClassName: string; iconName: "clock" | "check" | "truck" | "alert" }
> = {
  pending: { colorClassName: "text-accent", iconName: "clock" },
  confirmed: { colorClassName: "text-emerald-600", iconName: "check" },
  shipping: { colorClassName: "text-blue-500", iconName: "truck" },
  delivered: { colorClassName: "text-foreground", iconName: "check" },
  cancelled: { colorClassName: "text-destructive", iconName: "alert" },
}

export const SUPPORT_STATUS_OPTIONS = ["open", "in_progress", "resolved"] as const satisfies readonly SupportStatus[]

export const SUPPORT_STATUS_UI_CONFIG: Record<
  SupportStatus,
  { colorClassName: string; iconName: "alert" | "clock" | "check" }
> = {
  open: { colorClassName: "text-red-500", iconName: "alert" },
  in_progress: { colorClassName: "text-yellow-500", iconName: "clock" },
  resolved: { colorClassName: "text-green-500", iconName: "check" },
}

export const APPOINTMENT_STATUS_OPTIONS = [
  "new",
  "confirmed",
  "completed",
  "cancelled",
] as const satisfies readonly AppointmentStatus[]
