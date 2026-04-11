import type { SupportStatus } from "../types/store"

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatSupportStatusLabel(status: SupportStatus): string {
  return status.replace("_", " ")
}
