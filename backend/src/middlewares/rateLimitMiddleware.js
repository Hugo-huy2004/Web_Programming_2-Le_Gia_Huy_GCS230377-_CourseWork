import { env } from "../config/env.js";

function createRateLimiter(windowMs, maxRequests) {
  const entries = new Map();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.socket?.remoteAddress || "unknown";
    const current = entries.get(key);

    if (!current || now > current.resetAt) {
      entries.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (current.count >= maxRequests) {
      const retryAfter = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
      res.setHeader("Retry-After", String(retryAfter));
      return res.status(429).json({
        ok: false,
        message: "Too many requests. Please try again later.",
      });
    }

    current.count += 1;
    entries.set(key, current);
    return next();
  };
}

export const apiRateLimiter = createRateLimiter(env.apiRateLimitWindowMs, env.apiRateLimitMax);
export const authRateLimiter = createRateLimiter(env.authRateLimitWindowMs, env.authRateLimitMax);
