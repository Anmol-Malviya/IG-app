import mongoose from "mongoose";
import { config } from "./index";
import { logger } from "./logger";

/**
 * Connect to MongoDB with retry logic.
 * Handles connection events and graceful disconnect.
 */
export async function connectDatabase(): Promise<void> {
  const MAX_RETRIES = 5;
  const RETRY_DELAY_MS = 5000;

  mongoose.connection.on("connected", () => {
    logger.info("✅ MongoDB connected successfully");
  });

  mongoose.connection.on("error", (err) => {
    logger.error("❌ MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("⚠️ MongoDB disconnected");
  });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(config.mongodbUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      return;
    } catch (error) {
      logger.error(
        `MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed:`,
        error
      );

      if (attempt === MAX_RETRIES) {
        throw new Error(
          `Failed to connect to MongoDB after ${MAX_RETRIES} attempts`
        );
      }

      logger.info(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

/**
 * Gracefully disconnect from MongoDB.
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected gracefully");
  } catch (error) {
    logger.error("Error disconnecting from MongoDB:", error);
  }
}
