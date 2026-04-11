import { env } from "../config/env.js";

function getPaypalBaseUrl() {
  return env.paypalMode === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

function hasPaypalCredentials() {
  return Boolean(env.paypalClientId && env.paypalClientSecret);
}

export function isPaypalVerificationConfigured() {
  return hasPaypalCredentials();
}

async function fetchPaypalAccessToken() {
  const credentials = Buffer.from(`${env.paypalClientId}:${env.paypalClientSecret}`).toString("base64");
  const response = await fetch(`${getPaypalBaseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  if (!response.ok || !data?.access_token) {
    throw new Error(data?.error_description || data?.error || "Failed to fetch PayPal access token.");
  }

  return data.access_token;
}

export async function verifyPaypalOrder(orderId) {
  if (!orderId) {
    throw new Error("Missing PayPal order id.");
  }
  if (!hasPaypalCredentials()) {
    throw new Error("PayPal verification is not configured.");
  }

  const accessToken = await fetchPaypalAccessToken();
  const response = await fetch(`${getPaypalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "PayPal order lookup failed.");
  }

  return data;
}
