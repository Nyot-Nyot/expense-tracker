export default function errorHandler(err, req, res, next) {
  // Basic console logging for now; can be replaced by structured logger later
  console.error(err);

  if (err && err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code || err.name,
        message: err.message,
        details: err.details || null,
      },
    });
  }

  // Fallback for unknown errors
  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal Server Error",
    },
  });
}
