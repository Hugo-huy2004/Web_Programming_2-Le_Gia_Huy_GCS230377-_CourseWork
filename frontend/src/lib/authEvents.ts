export const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired"

type SessionExpiredDetail = {
  message?: string
}

export function emitSessionExpired(message?: string): void {
  window.dispatchEvent(
    new CustomEvent<SessionExpiredDetail>(AUTH_SESSION_EXPIRED_EVENT, {
      detail: { message },
    })
  )
}
