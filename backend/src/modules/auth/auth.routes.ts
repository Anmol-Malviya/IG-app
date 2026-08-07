import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validator";
import { authRateLimiter } from "../../middleware/rateLimiter";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "./auth.validation";

const router = Router();

// Apply strict rate limiting to all auth routes
router.use(authRateLimiter);

// --- Public routes ---
router.post(
  "/register",
  validate({ body: registerSchema }),
  AuthController.register
);
router.post(
  "/login",
  validate({ body: loginSchema }),
  AuthController.login
);
router.post(
  "/refresh",
  validate({ body: refreshTokenSchema }),
  AuthController.refresh
);

// --- Authenticated routes ---
router.post("/logout", authenticate, AuthController.logout);

export { router as authRoutes };
