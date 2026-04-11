import { env } from "../config/env.js";

function toText(value) {
  return String(value ?? "").trim();
}

export async function verifyGoogleIdToken(idToken) {
  const token = toText(idToken);
  if (!token) {
    throw new Error("Missing Google ID token.");
  }

  const endpoint = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`;
  const response = await fetch(endpoint);
  const payload = await response.json();

  if (!response.ok || payload?.error_description || payload?.error) {
    throw new Error(payload?.error_description || payload?.error || "Invalid Google token.");
  }

  if (payload?.email_verified !== "true") {
    throw new Error("Google email is not verified.");
  }

  if (env.googleClientId && payload?.aud !== env.googleClientId) {
    throw new Error("Google token audience mismatch.");
  }

  return {
    email: toText(payload?.email).toLowerCase(),
    name: toText(payload?.name) || "Google User",
    providerId: toText(payload?.sub),
  };
}
