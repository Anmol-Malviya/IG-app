import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { apiResponse } from "../../shared/utils/apiResponse";
import { asyncHandler } from "../../shared/utils/asyncHandler";

/**
 * Auth controller — handles HTTP requests for authentication.
 */
export class AuthController {
  /**
   * POST /api/auth/register — Register a new user.
   */
  static register = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);
    apiResponse.created(res, result, "Registration successful");
  });

  /**
   * POST /api/auth/login — Login with email and password.
   */
  static login = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    apiResponse.success(res, result, "Login successful");
  });

  /**
   * POST /api/auth/refresh — Refresh access token.
   */
  static refresh = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refreshToken(refreshToken);
    apiResponse.success(res, tokens, "Token refreshed");
  });

  /**
   * POST /api/auth/logout — Logout (client-side token removal).
   */
  static logout = asyncHandler(async (_req: Request, res: Response) => {
    // JWT is stateless — logout is handled client-side by removing tokens.
    // For enhanced security, implement a token blacklist with Redis.
    apiResponse.success(res, null, "Logout successful");
  });
}
