import { Tenant, ITenant } from "./tenant.model";
import { AppError } from "../../shared/errors/AppError";
import { PaginationQuery } from "../../shared/types/common";
import { CreateTenantInput, UpdateTenantInput } from "./tenant.validation";

/**
 * Tenant service — business logic for multi-tenant operations.
 */
export class TenantService {
  static async create(data: CreateTenantInput): Promise<ITenant> {
    const existing = await Tenant.findOne({ slug: data.slug });
    if (existing) throw AppError.conflict("Tenant slug already exists");
    return Tenant.create(data);
  }

  static async findById(id: string): Promise<ITenant> {
    const tenant = await Tenant.findById(id);
    if (!tenant) throw AppError.notFound("Tenant not found");
    return tenant;
  }

  static async findAll(
    pagination: PaginationQuery
  ): Promise<{ tenants: ITenant[]; total: number }> {
    const [tenants, total] = await Promise.all([
      Tenant.find()
        .sort({ [pagination.sortBy || "createdAt"]: pagination.sortOrder === "asc" ? 1 : -1 })
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit),
      Tenant.countDocuments(),
    ]);
    return { tenants, total };
  }

  static async update(id: string, data: UpdateTenantInput): Promise<ITenant> {
    const tenant = await Tenant.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!tenant) throw AppError.notFound("Tenant not found");
    return tenant;
  }

  static async delete(id: string): Promise<void> {
    const tenant = await Tenant.findByIdAndDelete(id);
    if (!tenant) throw AppError.notFound("Tenant not found");
  }
}
