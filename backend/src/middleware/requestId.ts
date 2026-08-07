import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

/**
 * Assigns a unique request ID to every incoming request.
 * Useful for debugging and log correlation across services.
 *
 * The ID is:
 * - Attached to req.requestId
 * - Returned in the X-Request-ID response header
 */
export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId =
    (req.headers["x-request-id"] as string) || uuidv4();

  req.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);
  next();
}
