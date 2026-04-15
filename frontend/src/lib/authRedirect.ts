import { toast } from "sonner"

const POST_LOGIN_REDIRECT_KEY = "post-login-redirect"
const AUTH_TOAST_COOLDOWN_MS = 1500

let lastAuthToastAt = 0

function getCurrentPathWithQueryAndHash() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

export function rememberPostLoginRedirect(path = getCurrentPathWithQueryAndHash()) {
  if (!path || path === "/user") return
  sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, path)
}

export function consumePostLoginRedirect(): string | null {
  const raw = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY)
  sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY)

  if (!raw) return null
  if (!raw.startsWith("/")) return null
  if (raw.startsWith("//")) return null
  if (raw === "/user") return null

  return raw
}

export function showAuthToastOnce(message: string) {
  const now = Date.now()
  if (now - lastAuthToastAt < AUTH_TOAST_COOLDOWN_MS) {
    return
  }

  lastAuthToastAt = now
  toast.error(message)
}