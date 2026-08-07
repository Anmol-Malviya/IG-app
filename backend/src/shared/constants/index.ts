/**
 * Application-wide constants.
 */

/** Default pagination values */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

/** User role hierarchy (higher index = more permissions) */
export const ROLE_HIERARCHY = {
  user: 0,
  admin: 1,
  superadmin: 2,
} as const;

/** HTTP status codes used frequently */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  VALIDATION_ERROR: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
} as const;

/** Cookie names */
export const COOKIE_NAMES = {
  REFRESH_TOKEN: "refreshToken",
} as const;
