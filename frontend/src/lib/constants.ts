/**
 * Application constants.
 */

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "IG App";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
} as const;
