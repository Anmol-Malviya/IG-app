import { Request } from "express";
import { PaginationMeta, PaginationQuery } from "../types/common";

/**
 * Parse pagination params from request query.
 * Provides safe defaults and limits.
 *
 * @example
 * const { page, limit, sortBy, sortOrder } = parsePagination(req);
 */
export function parsePagination(req: Request): PaginationQuery {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit as string, 10) || 10)
  );
  const sortBy = (req.query.sortBy as string) || "createdAt";
  const sortOrder =
    (req.query.sortOrder as string) === "asc" ? "asc" : "desc";

  return { page, limit, sortBy, sortOrder };
}

/**
 * Build pagination metadata from query results.
 *
 * @example
 * const meta = buildPaginationMeta(total, page, limit);
 */
export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
