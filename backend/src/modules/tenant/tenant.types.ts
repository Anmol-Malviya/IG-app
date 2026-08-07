/**
 * Tenant module type definitions.
 */

import { ITenant } from "./tenant.model";

export interface TenantResponse {
  _id: string;
  name: string;
  slug: string;
  domain?: string;
  plan: string;
  isActive: boolean;
  settings: {
    maxUsers: number;
    features: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export function toTenantResponse(tenant: ITenant): TenantResponse {
  const obj = tenant.toJSON();
  return {
    _id: obj._id.toString(),
    name: obj.name,
    slug: obj.slug,
    domain: obj.domain,
    plan: obj.plan,
    isActive: obj.isActive,
    settings: obj.settings,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}
