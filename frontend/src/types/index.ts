/**
 * Shared TypeScript type definitions for the frontend.
 */

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "superadmin" | "admin" | "user";
  tenantId?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  _id: string;
  name: string;
  slug: string;
  domain?: string;
  plan: "free" | "starter" | "pro" | "enterprise";
  isActive: boolean;
  settings: {
    maxUsers: number;
    features: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
