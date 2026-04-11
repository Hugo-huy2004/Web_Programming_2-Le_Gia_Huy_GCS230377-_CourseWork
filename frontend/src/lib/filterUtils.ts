export function toSafeArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : []
}

export function normalizeKeyword(value: string): string {
  return value.trim().toLowerCase()
}

export function includesKeyword(text: string | null | undefined, keyword: string): boolean {
  if (!keyword) return true
  return (text ?? "").toLowerCase().includes(keyword)
}

export function matchesStatusFilter<T extends string>(
  value: T,
  statusFilter: "all" | T
): boolean {
  return statusFilter === "all" || value === statusFilter
}
