"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisConnection = getRedisConnection;
exports.closeRedisConnection = closeRedisConnection;
// src/queues/connection.ts
const ioredis_1 = require("ioredis");
const redis_1 = require("../config/redis");
const logger_1 = __importDefault(require("../config/logger"));
let redisInstance = null;
/**
 * Returns a shared Redis connection instance for BullMQ.
 * Waits until Redis is fully ready before resolving.
 */
async function getRedisConnection() {
    if (!redisInstance) {
        redisInstance = new ioredis_1.Redis(redis_1.redisOptions);
        redisInstance.on("connect", () => {
            logger_1.default.info(`[Redis] Connected to ${redis_1.redisOptions.host}:${redis_1.redisOptions.port}`);
        });
        redisInstance.on("error", (err) => {
            logger_1.default.error("[Redis] Error:", err);
        });
        redisInstance.on("reconnecting", () => {
            logger_1.default.warn("[Redis] Reconnecting...");
        });
        // Wait until Redis is ready
        await Promise.race([
            new Promise((resolve, reject) => {
                redisInstance.once("ready", resolve);
                redisInstance.once("error", reject);
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Redis connection timeout")), 5000)),
        ]);
    }
    return redisInstance;
}
/** Graceful shutdown */
async function closeRedisConnection() {
    if (redisInstance) {
        await redisInstance.quit();
        logger_1.default.info("[Redis] Connection closed.");
        redisInstance = null;
    }
}
//# sourceMappingURL=connection.js.map