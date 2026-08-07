import { Router } from "express";
import { UserController } from "./user.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { authorize } from "../../middleware/rbac.middleware";
import { validate } from "../../middleware/validator";
import { updateUserSchema, getUserByIdSchema } from "./user.validation";

const router = Router();

// --- Authenticated user routes ---
router.get("/me", authenticate, UserController.getMe);
router.put(
  "/me",
  authenticate,
  validate({ body: updateUserSchema }),
  UserController.updateMe
);

// --- Admin routes ---
router.get("/", authenticate, authorize("admin"), UserController.getAll);
router.get(
  "/:id",
  authenticate,
  authorize("admin"),
  validate({ params: getUserByIdSchema }),
  UserController.getById
);
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  validate({ params: getUserByIdSchema }),
  UserController.deactivate
);

export { router as userRoutes };
