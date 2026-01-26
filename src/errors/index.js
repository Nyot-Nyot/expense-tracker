class HttpError extends Error {
  constructor(message, code = "ERROR", statusCode = 500, details) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends HttpError {
  constructor(message = "Validation Error", details) {
    super(message, "VALIDATION_ERROR", 400, details);
  }
}

class AuthenticationError extends HttpError {
  constructor(message = "Authentication failed", details) {
    super(message, "AUTHENTICATION_ERROR", 401, details);
  }
}

class ConflictError extends HttpError {
  constructor(message = "Conflict", details) {
    super(message, "CONFLICT_ERROR", 409, details);
  }
}

class NotFoundError extends HttpError {
  constructor(message = "Not Found", details) {
    super(message, "NOT_FOUND", 404, details);
  }
}

class ForbiddenError extends HttpError {
  constructor(message = "Forbidden", details) {
    super(message, "FORBIDDEN", 403, details);
  }
}

export {
  AuthenticationError,
  ConflictError,
  ForbiddenError,
  HttpError,
  NotFoundError,
  ValidationError,
};
