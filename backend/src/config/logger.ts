import winston from "winston";
import { config } from "./index";

/**
 * Production-ready logger with structured JSON output.
 * Uses console transport for Render's log aggregation.
 */
const logFormat = config.isProduction
  ? winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    )
  : winston.format.combine(
      winston.format.timestamp({ format: "HH:mm:ss" }),
      winston.format.errors({ stack: true }),
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
        return `${timestamp} ${level}: ${message} ${metaStr}`;
      })
    );

export const logger = winston.createLogger({
  level: config.logLevel,
  format: logFormat,
  defaultMeta: { service: "ig-app-backend" },
  transports: [new winston.transports.Console()],
});
