import { Request, Response } from "express";
import { TenantService } from "./tenant.service";
import { apiResponse } from "../../shared/utils/apiResponse";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { parsePagination, buildPaginationMeta } from "../../shared/utils/pagination";
import { toTenantResponse } from "./tenant.types";

export class TenantController {
  static create = asyncHandler(async (req: Request, res: Response) => {
    const tenant = await TenantService.create(req.body);
    apiResponse.created(res, toTenantResponse(tenant), "Tenant created");
  });

  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePagination(req);
    const { tenants, total } = await TenantService.findAll(pagination);
    const meta = buildPaginationMeta(total, pagination.page, pagination.limit);
    apiResponse.paginated(res, tenants.map(toTenantResponse), meta, "Tenants fetched");
  });

  static getById = asyncHandler(async (req: Request, res: Response) => {
    const tenant = await TenantService.findById(req.params.id as string);
    apiResponse.success(res, toTenantResponse(tenant), "Tenant fetched");
  });

  static update = asyncHandler(async (req: Request, res: Response) => {
    const tenant = await TenantService.update(req.params.id as string, req.body);
    apiResponse.success(res, toTenantResponse(tenant), "Tenant updated");
  });

  static delete = asyncHandler(async (req: Request, res: Response) => {
    await TenantService.delete(req.params.id as string);
    apiResponse.noContent(res);
  });
}
