import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../shared/utils/crypto";
import { AppError } from "../shared/errors/AppError";
import { logger } from "../config/logger";

/**
 * JWT authentication middleware.
 * Verifies the Bearer token from Authorization header.
 * Attaches decoded user data to req.user.
 *
 * @example
 * router.get("/profile", authenticate, getProfile);
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw AppError.unauthorized("No token provided");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw AppError.unauthorized("Invalid token format");
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    logger.warn("Token verification failed:", { error });
    next(AppError.unauthorized("Invalid or expired token"));
  }
}

/**
 * Optional authentication — attaches user if token is present, but doesn't require it.
 */
export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token) {
        req.user = verifyAccessToken(token);
      }
    }
  } catch {
    // Token invalid — continue without user
  }

  next();
}
