import dotenv from "dotenv";

dotenv.config();

/**
 * Centralized configuration — all environment variables accessed through here.
 * Never use process.env directly in application code.
 */
export const config = {
  // Server
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",

  // Database
  mongodbUri: process.env.MONGODB_URI || "mongodb://localhost:27017/ig-app",

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || "dev-jwt-secret-change-in-production",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "dev-jwt-refresh-secret-change-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  // CORS
  corsOrigins: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
    : ["http://localhost:3000", "http://localhost:3001"],

  // Logging
  logLevel: process.env.LOG_LEVEL || "debug",

  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
  },
} as const;

/**
 * Validate required environment variables in production.
 * Called once at startup.
 */
export function validateConfig(): void {
  if (!config.isProduction) return;

  const required = [
    "JWT_SECRET",
    "JWT_REFRESH_SECRET",
    "MONGODB_URI",
    "CORS_ORIGINS",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables: ${missing.join(", ")}`
    );
  }

  if (config.jwt.secret === "dev-jwt-secret-change-in-production") {
    throw new Error("❌ JWT_SECRET must be changed in production");
  }
}
