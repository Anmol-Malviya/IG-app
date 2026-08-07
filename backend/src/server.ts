import { app } from "./app";
import { config, validateConfig } from "./config";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { logger } from "./config/logger";

/**
 * Server entry point with graceful shutdown.
 * Handles SIGTERM (Render sends this during deploys) and SIGINT (Ctrl+C).
 */
async function startServer(): Promise<void> {
  try {
    // Validate environment variables in production
    validateConfig();

    // Connect to MongoDB
    await connectDatabase();

    // Start HTTP server
    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server running on http://localhost:${config.port}`);
      logger.info(`📌 Environment: ${config.nodeEnv}`);
      logger.info(`📋 Health check: http://localhost:${config.port}/health`);
    });

    // ─── Graceful Shutdown ────────────────────────────────────────────
    const gracefulShutdown = async (signal: string) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);

      // Stop accepting new connections
      server.close(async () => {
        logger.info("HTTP server closed");

        // Disconnect from database
        await disconnectDatabase();

        logger.info("Graceful shutdown complete");
        process.exit(0);
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error("Forced shutdown — timeout exceeded");
        process.exit(1);
      }, 30000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle unhandled rejections
    process.on("unhandledRejection", (reason) => {
      logger.error("Unhandled Rejection:", reason);
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception:", error);
      process.exit(1);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
