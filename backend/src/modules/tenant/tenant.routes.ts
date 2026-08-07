import { Router } from "express";
import { TenantController } from "./tenant.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validator";
import {
  createTenantSchema,
  updateTenantSchema,
  getTenantByIdSchema,
} from "./tenant.validation";

const router = Router();

// All tenant routes require superadmin access
router.use(authenticate, authorize("superadmin"));

router.post("/", validate({ body: createTenantSchema }), TenantController.create);
router.get("/", TenantController.getAll);
router.get("/:id", validate({ params: getTenantByIdSchema }), TenantController.getById);
router.put(
  "/:id",
  validate({ params: getTenantByIdSchema, body: updateTenantSchema }),
  TenantController.update
);
router.delete(
  "/:id",
  validate({ params: getTenantByIdSchema }),
  TenantController.delete
);

export { router as tenantRoutes };
