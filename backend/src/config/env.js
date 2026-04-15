import dotenv from "dotenv";
dotenv.config();

function required(name, fallback = null) {
    const value = process.env[name];
    if (!value) {
        if (fallback !== null) return fallback;
        throw new Error(`Missing required env var: ${name}`);
    }
    return value;
}

function toNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function parseAllowedOrigins() {
    const raw = process.env.CLIENT_ORIGIN ?? "http://localhost:5174";
    return raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

export const env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: toNumber(process.env.PORT, 4000),
    mongoUri: required("MONGODB_URI"),
    clientOrigins: parseAllowedOrigins(),
    jwtSecret: required("JWT_SECRET"),
    adminApiKey: required("ADMIN_API_KEY", "admin-key-dev"),
    otpExpiresMinutes: toNumber(process.env.OTP_EXPIRES_MINUTES, 5),
    apiRateLimitWindowMs: toNumber(process.env.API_RATE_LIMIT_WINDOW_MS, 60_000),
    apiRateLimitMax: toNumber(process.env.API_RATE_LIMIT_MAX, 120),
    authRateLimitWindowMs: toNumber(process.env.AUTH_RATE_LIMIT_WINDOW_MS, 60_000),
    authRateLimitMax: toNumber(process.env.AUTH_RATE_LIMIT_MAX, 8),
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
    googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
    paypalMode: process.env.PAYPAL_MODE === "live" ? "live" : "sandbox",
    paypalClientId: process.env.PAYPAL_CLIENT_ID ?? "",
    paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET ?? "",
};
