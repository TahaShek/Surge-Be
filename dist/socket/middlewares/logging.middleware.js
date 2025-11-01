"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketPerformanceMiddleware = exports.socketErrorLoggingMiddleware = exports.createEventLoggingMiddleware = exports.socketLoggingMiddleware = void 0;
// src/socket/middlewares/logging.middleware.ts
const logger_1 = __importDefault(require("../../config/logger"));
/**
 * Socket.IO Logging Middleware
 * Logs connection events and user activities
 */
const socketLoggingMiddleware = (socket, next) => {
    const clientInfo = {
        socketId: socket.id,
        userId: socket.data.userId || "anonymous",
        userAgent: socket.handshake.headers["user-agent"],
        ip: socket.handshake.address,
        timestamp: new Date().toISOString(),
    };
    logger_1.default.info(`Socket connection attempt:`, clientInfo);
    // Log when socket disconnects
    socket.on("disconnect", (reason) => {
        const disconnectInfo = {
            ...clientInfo,
            reason,
            connectedDuration: socket.data.connectedAt
                ? Date.now() - socket.data.connectedAt.getTime()
                : 0,
            lastActivity: socket.data.lastActivity?.toISOString(),
        };
        logger_1.default.info(`Socket disconnected:`, disconnectInfo);
    });
    next();
};
exports.socketLoggingMiddleware = socketLoggingMiddleware;
/**
 * Middleware to log specific events
 */
const createEventLoggingMiddleware = (eventName) => {
    return (socket, next) => {
        const eventInfo = {
            event: eventName,
            socketId: socket.id,
            userId: socket.data.userId || "anonymous",
            timestamp: new Date().toISOString(),
        };
        logger_1.default.debug(`Socket event: ${eventName}`, eventInfo);
        next();
    };
};
exports.createEventLoggingMiddleware = createEventLoggingMiddleware;
/**
 * Middleware to log errors
 */
const socketErrorLoggingMiddleware = (socket, error, eventName) => {
    const errorInfo = {
        error: error.message,
        stack: error.stack,
        socketId: socket.id,
        userId: socket.data.userId || "anonymous",
        event: eventName,
        timestamp: new Date().toISOString(),
        userAgent: socket.handshake.headers["user-agent"],
        ip: socket.handshake.address,
    };
    logger_1.default.error(`Socket error:`, errorInfo);
};
exports.socketErrorLoggingMiddleware = socketErrorLoggingMiddleware;
/**
 * Performance monitoring middleware
 */
const socketPerformanceMiddleware = (socket, next) => {
    // Store connection start time
    socket.data.lastActivity = new Date();
    // Log connection performance metrics periodically
    const performanceInterval = setInterval(() => {
        const uptime = Date.now() - socket.data.connectedAt.getTime();
        const lastActivity = socket.data.lastActivity ?
            Date.now() - socket.data.lastActivity.getTime() : 0;
        if (lastActivity > 300000) { // 5 minutes of inactivity
            logger_1.default.debug(`Socket inactive:`, {
                socketId: socket.id,
                userId: socket.data.userId || "anonymous",
                uptime: `${uptime}ms`,
                lastActivity: `${lastActivity}ms ago`,
            });
        }
    }, 60000); // Check every minute
    // Clear interval on disconnect
    socket.on("disconnect", () => {
        clearInterval(performanceInterval);
    });
    next();
};
exports.socketPerformanceMiddleware = socketPerformanceMiddleware;
//# sourceMappingURL=logging.middleware.js.map