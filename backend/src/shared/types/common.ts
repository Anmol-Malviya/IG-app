/**
 * Common TypeScript interfaces used across the application.
 */

/** User roles for RBAC */
export type UserRole = "superadmin" | "admin" | "user";

/** Tenant plans */
export type TenantPlan = "free" | "starter" | "pro" | "enterprise";

/** Paginated query params */
export interface PaginationQuery {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/** Paginated response metadata */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/** Standard API success response */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message: string;
  meta?: PaginationMeta;
}

/** Standard API error response */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
}

/** JWT payload structure */
export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  tenantId?: string;
}

/** Refresh token payload */
export interface RefreshTokenPayload {
  userId: string;
  tokenVersion?: number;
}
