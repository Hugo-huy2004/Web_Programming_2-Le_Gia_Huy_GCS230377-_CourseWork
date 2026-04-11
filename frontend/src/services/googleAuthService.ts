import { jwtDecode } from "jwt-decode"
import type { CredentialResponse } from "@react-oauth/google"
import { type CustomerDto, upsertGoogleCustomerRequest } from "../lib/api"

type GoogleJwtPayload = {
  email?: string
  name?: string
}

function decodeGoogleIdentityToken(token: string): { email: string; name: string } {
  const decoded = jwtDecode<GoogleJwtPayload>(token)
  const email = (decoded.email || "").trim().toLowerCase()
  const name = (decoded.name || "User").trim()

  if (!email) {
    throw new Error("Email not found in Google credential")
  }

  return { email, name }
}

export async function loginCustomerWithGoogle(
  credential: CredentialResponse
): Promise<{ ok: boolean; message: string; customer?: CustomerDto; accessToken?: string }> {
  try {
    const identityToken = credential?.credential
    if (!identityToken) {
      return { ok: false, message: "No credential received from Google" }
    }

    decodeGoogleIdentityToken(identityToken)
    const response = await upsertGoogleCustomerRequest({
      idToken: identityToken,
    })

    return {
      ok: true,
      message: response.message || "Login successful",
      customer: response.customer,
      accessToken: response.accessToken,
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Google login failed",
    }
  }
}
