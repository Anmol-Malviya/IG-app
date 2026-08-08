import express from "express";
import cors from "cors";
import compression from "compression";
import hpp from "hpp";

import { corsOptions } from "./config/cors";
import { securityHeaders } from "./middleware/securityHeaders";
import { requestIdMiddleware } from "./middleware/requestId";
import { apiRateLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";

// Module routes
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.routes";
import { tenantRoutes } from "./modules/tenant/tenant.routes";
import { statsRoutes } from "./modules/stats/stats.routes";
import { scheduleRoutes } from "./modules/schedule/schedule.routes";

/**
 * Express application setup.
 * Separated from server.ts so it can be imported for testing.
 */
const app = express();

// ─── Security Middleware ─────────────────────────────────────────────
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(hpp()); // Prevent HTTP parameter pollution

// ─── Request Processing ─────────────────────────────────────────────
app.use(requestIdMiddleware);
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Rate Limiting ──────────────────────────────────────────────────
app.use("/api", apiRateLimiter);

// ─── Health Check (no auth required) ────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
    },
  });
});

// ─── API Routes ─────────────────────────────────────────────────────
// Register module routes here. Add new modules by adding a single line.
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/schedules", scheduleRoutes);

// ─── 404 Handler ────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "The requested endpoint does not exist",
    },
  });
});

// ─── Global Error Handler (must be last) ────────────────────────────
app.use(errorHandler);

export { app };
