/**
 * Auth helper functions — token management for client-side.
 */

export interface AuthUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Store tokens and user data after login/register.
 */
export function setAuth(user: AuthUser, tokens: AuthTokens): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("accessToken", tokens.accessToken);
  localStorage.setItem("refreshToken", tokens.refreshToken);
  localStorage.setItem("user", JSON.stringify(user));
}

/**
 * Get the current authenticated user from localStorage.
 */
export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

/**
 * Get the current access token.
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

/**
 * Check if user is authenticated.
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

/**
 * Clear all auth data (logout).
 */
export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}
