import { JwtPayload } from "./common";

/**
 * Extend Express Request to include authenticated user data.
 */
declare global {
  namespace Express {
    interface Request {
      /** Authenticated user data from JWT */
      user?: JwtPayload;
      /** Unique request ID for tracing */
      requestId?: string;
    }
  }
}

export {};
