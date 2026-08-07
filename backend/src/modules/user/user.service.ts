import { User, IUser } from "./user.model";
import { AppError } from "../../shared/errors/AppError";
import { PaginationQuery } from "../../shared/types/common";
import { UpdateUserInput } from "./user.validation";

/**
 * User service — business logic for user operations.
 * Controllers call service methods; services interact with the model.
 */
export class UserService {
  /**
   * Find user by ID.
   */
  static async findById(id: string): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) throw AppError.notFound("User not found");
    return user;
  }

  /**
   * Find user by email.
   */
  static async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() });
  }

  /**
   * Find user by email with password field included.
   */
  static async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return User.findOne({ email: email.toLowerCase() }).select("+password");
  }

  /**
   * List users with pagination.
   */
  static async findAll(
    pagination: PaginationQuery,
    filters: { tenantId?: string; isActive?: boolean } = {}
  ): Promise<{ users: IUser[]; total: number }> {
    const query: Record<string, unknown> = {};
    if (filters.tenantId) query.tenantId = filters.tenantId;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ [pagination.sortBy || "createdAt"]: pagination.sortOrder === "asc" ? 1 : -1 })
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit),
      User.countDocuments(query),
    ]);

    return { users, total };
  }

  /**
   * Update user by ID.
   */
  static async update(id: string, data: UpdateUserInput): Promise<IUser> {
    const user = await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!user) throw AppError.notFound("User not found");
    return user;
  }

  /**
   * Soft-delete (deactivate) user.
   */
  static async deactivate(id: string): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    if (!user) throw AppError.notFound("User not found");
    return user;
  }
}
