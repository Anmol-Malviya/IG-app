import { Request, Response } from "express";
import { User } from "../user/user.model";
import { Tenant } from "../tenant/tenant.model";
import { apiResponse } from "../../shared/utils/apiResponse";
import { asyncHandler } from "../../shared/utils/asyncHandler";

/**
 * Stats controller — lightweight aggregation endpoints for the admin dashboard.
 */
export class StatsController {
  /**
   * GET /api/stats/overview — System-wide counts for the dashboard.
   */
  static overview = asyncHandler(async (_req: Request, res: Response) => {
    const [totalUsers, activeUsers, totalTenants, activeTenants] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isActive: true }),
        Tenant.countDocuments(),
        Tenant.countDocuments({ isActive: true }),
      ]);

    apiResponse.success(
      res,
      { totalUsers, activeUsers, totalTenants, activeTenants },
      "Stats fetched"
    );
  });
}
