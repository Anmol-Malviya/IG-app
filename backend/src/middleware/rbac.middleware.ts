import { Request, Response, NextFunction } from "express";
import { UserRole } from "../shared/types/common";
import { AppError } from "../shared/errors/AppError";
import { ROLE_HIERARCHY } from "../shared/constants";

/**
 * Role-based access control middleware.
 * Must be used AFTER authenticate middleware.
 *
 * @example
 * // Only admins and superadmins
 * router.get("/users", authenticate, authorize("admin"), getUsers);
 *
 * // Only superadmins
 * router.delete("/tenants/:id", authenticate, authorize("superadmin"), deleteTenant);
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(AppError.unauthorized("Authentication required"));
      return;
    }

    const userRoleLevel = ROLE_HIERARCHY[req.user.role] ?? -1;
    const hasAccess = allowedRoles.some(
      (role) => userRoleLevel >= ROLE_HIERARCHY[role]
    );

    if (!hasAccess) {
      next(
        AppError.forbidden(
          `Role '${req.user.role}' does not have access to this resource`
        )
      );
      return;
    }

    next();
  };
}
