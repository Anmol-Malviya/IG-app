/**
 * Custom application error class.
 * Use this instead of `throw new Error()` for consistent error handling.
 *
 * @example
 * throw new AppError("User not found", 404, "USER_NOT_FOUND");
 * throw AppError.badRequest("Email is required");
 * throw AppError.unauthorized("Invalid token");
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown[];

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = "INTERNAL_ERROR",
    details?: unknown[],
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    // Maintains proper stack trace
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  // --- Factory methods for common errors ---

  static badRequest(message: string, details?: unknown[]): AppError {
    return new AppError(message, 400, "BAD_REQUEST", details);
  }

  static unauthorized(message: string = "Unauthorized"): AppError {
    return new AppError(message, 401, "UNAUTHORIZED");
  }

  static forbidden(message: string = "Forbidden"): AppError {
    return new AppError(message, 403, "FORBIDDEN");
  }

  static notFound(message: string = "Resource not found"): AppError {
    return new AppError(message, 404, "NOT_FOUND");
  }

  static conflict(message: string): AppError {
    return new AppError(message, 409, "CONFLICT");
  }

  static tooManyRequests(message: string = "Too many requests"): AppError {
    return new AppError(message, 429, "TOO_MANY_REQUESTS");
  }

  static internal(message: string = "Internal server error"): AppError {
    return new AppError(message, 500, "INTERNAL_ERROR", undefined, false);
  }

  static validationError(message: string, details: unknown[]): AppError {
    return new AppError(message, 422, "VALIDATION_ERROR", details);
  }
}
