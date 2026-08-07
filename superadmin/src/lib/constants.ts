export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "IG App Admin";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  USERS: "/users",
  TENANTS: "/tenants",
  SETTINGS: "/settings",
} as const;
