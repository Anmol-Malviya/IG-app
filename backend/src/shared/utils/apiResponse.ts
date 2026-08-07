import { Response } from "express";
import {
  ApiSuccessResponse,
  ApiErrorResponse,
  PaginationMeta,
} from "../types/common";

/**
 * Standardized API response helper.
 * Use this for ALL API responses to ensure consistent format.
 *
 * @example
 * // Success
 * apiResponse.success(res, user, "User created", 201);
 *
 * // Success with pagination
 * apiResponse.paginated(res, users, meta, "Users fetched");
 *
 * // Error
 * apiResponse.error(res, 404, "NOT_FOUND", "User not found");
 */
export const apiResponse = {
  success<T>(
    res: Response,
    data: T,
    message: string = "Success",
    statusCode: number = 200
  ): Response<ApiSuccessResponse<T>> {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
    });
  },

  paginated<T>(
    res: Response,
    data: T,
    meta: PaginationMeta,
    message: string = "Success"
  ): Response<ApiSuccessResponse<T>> {
    return res.status(200).json({
      success: true,
      data,
      message,
      meta,
    });
  },

  error(
    res: Response,
    statusCode: number,
    code: string,
    message: string,
    details?: unknown[]
  ): Response<ApiErrorResponse> {
    return res.status(statusCode).json({
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
    });
  },

  created<T>(
    res: Response,
    data: T,
    message: string = "Created successfully"
  ): Response<ApiSuccessResponse<T>> {
    return apiResponse.success(res, data, message, 201);
  },

  noContent(res: Response): Response {
    return res.status(204).send();
  },
};
