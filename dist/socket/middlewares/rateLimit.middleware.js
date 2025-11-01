"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketActivityMiddleware = exports.createEventRateLimit = exports.socketRateLimitMiddleware = void 0;
// src/socket/middlewares/rateLimit.middleware.ts
const env_1 = require("../../config/env");
const logger_1 = __importDefault(require("../../config/logger"));
/**
 * Socket.IO Rate Limiting Middleware
 * Prevents spam and abuse by limiting requests per socket
 */
const socketRateLimitMiddleware = (socket, next) => {
    const now = Date.now();
    // Reset rate limit window if expired
    if (now > socket.data.rateLimitReset) {
        socket.data.rateLimitCount = 0;
        socket.data.rateLimitReset = now + env_1.config.SOCKETIO.rateLimit.windowMs;
    }
    // Check if rate limit exceeded
    if (socket.data.rateLimitCount >= env_1.config.SOCKETIO.rateLimit.maxRequests) {
        const retryAfter = Math.ceil((socket.data.rateLimitReset - now) / 1000);
        logger_1.default.warn(`Socket ${socket.id}: Rate limit exceeded (${socket.data.rateLimitCount}/${env_1.config.SOCKETIO.rateLimit.maxRequests}). ` +
            `Retry after ${retryAfter} seconds`);
        // Emit rate limit error to client
        socket.emit("rate_limit_exceeded", { retryAfter });
        return next(new Error(`Rate limit exceeded. Try again in ${retryAfter} seconds.`));
    }
    // Increment rate limit counter
    socket.data.rateLimitCount++;
    socket.data.lastActivity = new Date();
    next();
};
exports.socketRateLimitMiddleware = socketRateLimitMiddleware;
/**
 * Creates a rate limit middleware for specific events
 */
const createEventRateLimit = (maxRequests, windowMs) => {
    const eventLimits = new Map();
    return (socket, next) => {
        const socketId = socket.id;
        const now = Date.now();
        // Get or create rate limit info for this socket
        let rateLimitInfo = eventLimits.get(socketId);
        if (!rateLimitInfo || now > rateLimitInfo.resetTime) {
            rateLimitInfo = {
                count: 0,
                resetTime: now + windowMs
            };
            eventLimits.set(socketId, rateLimitInfo);
        }
        // Check rate limit
        if (rateLimitInfo.count >= maxRequests) {
            const retryAfter = Math.ceil((rateLimitInfo.resetTime - now) / 1000);
            logger_1.default.warn(`Socket ${socketId}: Event rate limit exceeded (${rateLimitInfo.count}/${maxRequests}). ` +
                `Retry after ${retryAfter} seconds`);
            socket.emit("rate_limit_exceeded", { retryAfter });
            return next(new Error(`Rate limit exceeded for this event`));
        }
        // Increment counter
        rateLimitInfo.count++;
        // Clean up old entries periodically
        if (Math.random() < 0.01) { // 1% chance
            cleanupOldEntries(eventLimits);
        }
        next();
    };
};
exports.createEventRateLimit = createEventRateLimit;
/**
 * Cleanup old rate limit entries to prevent memory leaks
 */
function cleanupOldEntries(eventLimits) {
    const now = Date.now();
    const toDelete = [];
    for (const [socketId, info] of eventLimits.entries()) {
        if (now > info.resetTime + 60000) { // Keep for 1 minute after reset
            toDelete.push(socketId);
        }
    }
    toDelete.forEach(socketId => {
        eventLimits.delete(socketId);
    });
    if (toDelete.length > 0) {
        logger_1.default.debug(`Cleaned up ${toDelete.length} old rate limit entries`);
    }
}
/**
 * Middleware to update activity timestamp
 */
const socketActivityMiddleware = (socket, next) => {
    socket.data.lastActivity = new Date();
    next();
};
exports.socketActivityMiddleware = socketActivityMiddleware;
//# sourceMappingURL=rateLimit.middleware.js.map