"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePing = exports.handleAuthentication = exports.handleConnectionError = exports.handleDisconnect = exports.handleConnection = void 0;
// src/socket/handlers/connection.handler.ts
const logger_1 = __importDefault(require("../../config/logger"));
const connection_1 = require("../utils/connection");
const room_1 = require("../utils/room");
const logging_middleware_1 = require("../middlewares/logging.middleware");
const handleConnection = (socket) => {
    // Track the connection
    (0, connection_1.trackConnection)(socket);
    // Log connection details
    logger_1.default.info(`Socket connected: ${socket.id}`, {
        userId: socket.data.userId || "anonymous",
        isAuthenticated: socket.data.isAuthenticated,
        userAgent: socket.handshake.headers["user-agent"],
        ip: socket.handshake.address,
    });
    // Send welcome message
    socket.emit("connected", {
        message: "Connected to server successfully",
        timestamp: Date.now(),
    });
    // If user is authenticated, broadcast they're online
    if (socket.data.isAuthenticated && socket.data.userId) {
        (0, connection_1.broadcastUserOnline)(socket.data.userId);
    }
    // Set up error handling
    socket.on("error", (error) => {
        (0, logging_middleware_1.socketErrorLoggingMiddleware)(socket, error, "connection");
    });
};
exports.handleConnection = handleConnection;
const handleDisconnect = async (socket, reason) => {
    logger_1.default.info(`Socket disconnecting: ${socket.id}`, {
        userId: socket.data.userId || "anonymous",
        reason,
        connectedAt: socket.data.connectedAt,
        lastActivity: socket.data.lastActivity,
    });
    try {
        // Leave all rooms
        if (socket.data.rooms && socket.data.rooms.size > 0) {
            await (0, room_1.leaveAllRooms)(socket);
        }
        // Track disconnection (this handles user offline broadcasting)
        (0, connection_1.trackDisconnection)(socket, reason);
    }
    catch (error) {
        logger_1.default.error(`Error during disconnect cleanup for socket ${socket.id}:`, error);
    }
};
exports.handleDisconnect = handleDisconnect;
const handleConnectionError = (error) => {
    logger_1.default.error("Socket.IO connection error:", {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
    });
};
exports.handleConnectionError = handleConnectionError;
const handleAuthentication = async (socket, token, callback) => {
    try {
        // Authentication logic would go here
        // For now, we'll assume the middleware handled authentication
        if (socket.data.isAuthenticated && socket.data.user) {
            callback({
                success: true,
                user: {
                    id: socket.data.userId,
                    firstName: socket.data.user.firstName,
                    email: socket.data.user.email,
                },
            });
            // Broadcast user online status
            if (socket.data.userId) {
                (0, connection_1.broadcastUserOnline)(socket.data.userId);
            }
            logger_1.default.info(`Socket ${socket.id} authenticated successfully for user ${socket.data.userId}`);
        }
        else {
            callback({
                success: false,
                error: "Authentication failed",
            });
            logger_1.default.warn(`Socket ${socket.id} authentication failed`);
        }
    }
    catch (error) {
        logger_1.default.error(`Authentication error for socket ${socket.id}:`, error);
        callback({
            success: false,
            error: "Authentication error",
        });
    }
};
exports.handleAuthentication = handleAuthentication;
const handlePing = (socket, callback) => {
    socket.data.lastActivity = new Date();
    callback({
        pong: true,
        timestamp: Date.now(),
    });
    logger_1.default.debug(`Ping from socket ${socket.id}`);
};
exports.handlePing = handlePing;
//# sourceMappingURL=connection.handler.js.map