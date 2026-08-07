import { Request, Response } from "express";
import { UserService } from "./user.service";
import { apiResponse } from "../../shared/utils/apiResponse";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import {
  parsePagination,
  buildPaginationMeta,
} from "../../shared/utils/pagination";
import { toUserResponse } from "./user.types";

/**
 * User controller — handles HTTP requests for user operations.
 */
export class UserController {
  /**
   * GET /api/users/me — Get current authenticated user.
   */
  static getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.findById(req.user!.userId);
    apiResponse.success(res, toUserResponse(user), "User profile fetched");
  });

  /**
   * PUT /api/users/me — Update current authenticated user.
   */
  static updateMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.update(req.user!.userId, req.body);
    apiResponse.success(res, toUserResponse(user), "Profile updated");
  });

  /**
   * GET /api/users — List all users (Admin+).
   */
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePagination(req);
    const { users, total } = await UserService.findAll(pagination);
    const meta = buildPaginationMeta(total, pagination.page, pagination.limit);
    apiResponse.paginated(
      res,
      users.map(toUserResponse),
      meta,
      "Users fetched"
    );
  });

  /**
   * GET /api/users/:id — Get user by ID (Admin+).
   */
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.findById(req.params.id as string);
    apiResponse.success(res, toUserResponse(user), "User fetched");
  });

  /**
   * DELETE /api/users/:id — Deactivate user (Admin+).
   */
  static deactivate = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.deactivate(req.params.id as string);
    apiResponse.success(res, toUserResponse(user), "User deactivated");
  });
}
