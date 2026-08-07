import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors/AppError";
import { logger } from "../config/logger";
import { config } from "../config";

/**
 * Global error handler — catches all errors and returns standardized response.
 * Must be the LAST middleware registered in app.ts.
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Default error values
  let statusCode = 500;
  let code = "INTERNAL_ERROR";
  let message = "An unexpected error occurred";
  let details: unknown[] | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;

    // Log operational errors as warnings, programming errors as errors
    if (err.isOperational) {
      logger.warn(`[${req.requestId}] ${code}: ${message}`, {
        statusCode,
        path: req.path,
        method: req.method,
      });
    } else {
      logger.error(`[${req.requestId}] ${code}: ${message}`, {
        statusCode,
        path: req.path,
        method: req.method,
        stack: err.stack,
      });
    }
  } else {
    // Unknown error — log full stack
    logger.error(`[${req.requestId}] Unhandled error:`, {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message: config.isProduction && statusCode === 500 ? "Internal server error" : message,
      ...(details && { details }),
      ...(config.isDevelopment && statusCode === 500 && { stack: err.stack }),
    },
  });
}
