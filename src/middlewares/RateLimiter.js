import rateLimit from "express-rate-limit";

/**
 * Build a stable rate-limit key:
 *  - Prefer an authenticated user id
 *  - Fall back to the client's IP (honor X-Forwarded-For)
 *  - Otherwise return a sensible default
 */
const keyGenerator = (req) => {
  if (req?.user?.id) return `user_${req.user.id}`;

  const xff =
    req?.headers?.["x-forwarded-for"] ?? req?.headers?.["X-Forwarded-For"];
  if (xff) {
    const raw = Array.isArray(xff) ? xff.join(",") : String(xff);
    const firstIp = raw
      .split(",")
      .map((p) => p.trim())
      .find(Boolean);
    if (firstIp) return firstIp;
  }

  return (
    req?.ip ||
    req?.connection?.remoteAddress ||
    req?.socket?.remoteAddress ||
    "unknown_client"
  );
};

const RateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP/user to 60 requests per window
  keyGenerator,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests, please try again later.",
    },
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Auth endpoints limiter (IP-based, stricter)
const authKeyGenerator = (req) => {
  const xff =
    req?.headers?.["x-forwarded-for"] ?? req?.headers?.["X-Forwarded-For"];
  if (xff) {
    const raw = Array.isArray(xff) ? xff.join(",") : String(xff);
    const firstIp = raw
      .split(",")
      .map((p) => p.trim())
      .find(Boolean);
    if (firstIp) return firstIp;
  }

  return req?.ip || "unknown_client";
};

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  keyGenerator: authKeyGenerator,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many attempts, please try again later.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Global basic rate limiter
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests, please try again later.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default RateLimiter;
