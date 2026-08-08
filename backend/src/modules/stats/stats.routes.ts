import { Router } from "express";
import { StatsController } from "./stats.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";

const router = Router();

// All stats routes require superadmin access
router.use(authenticate, authorize("superadmin"));

router.get("/overview", StatsController.overview);

export { router as statsRoutes };
