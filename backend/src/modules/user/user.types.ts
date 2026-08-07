import { IUser } from "./user.model";

/**
 * User module type definitions.
 */

/** Sanitized user response (no password) */
export interface UserResponse {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/** Convert Mongoose user to safe response object */
export function toUserResponse(user: IUser): UserResponse {
  const obj = user.toJSON();
  return {
    _id: obj._id.toString(),
    email: obj.email,
    firstName: obj.firstName,
    lastName: obj.lastName,
    role: obj.role,
    tenantId: obj.tenantId?.toString(),
    isActive: obj.isActive,
    lastLogin: obj.lastLogin,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}
