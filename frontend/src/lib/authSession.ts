type PersistedAuthShape = {
  state?: {
    accessToken?: string | null
  }
}

export function readPersistedAccessToken(storageKey = "auth-state"): string | null {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return null

    const parsed = JSON.parse(raw) as PersistedAuthShape
    const token = parsed?.state?.accessToken
    if (typeof token !== "string" || token.trim().length === 0) {
      return null
    }

    return token
  } catch {
    return null
  }
}
