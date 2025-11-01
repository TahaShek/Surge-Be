"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketOptionalAuthMiddleware = exports.socketAuthMiddleware = void 0;
// src/socket/middlewares/auth.middleware.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const logger_1 = __importDefault(require("../../config/logger"));
const user_model_1 = require("../../models/user.model");
/**
 * Socket.IO Authentication Middleware
 * Validates JWT token and attaches user to socket
 */
const socketAuthMiddleware = async (socket, next) => {
    try {
        // Extract token from auth header or query params
        const token = socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.replace("Bearer ", "") ||
            socket.handshake.query?.token;
        if (!token) {
            logger_1.default.warn(`Socket ${socket.id}: No authentication token provided`);
            return next(new Error("Authentication token required"));
        }
        // Verify JWT token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, env_1.config.JWT.accessToken.secret);
        }
        catch (jwtError) {
            logger_1.default.warn(`Socket ${socket.id}: Invalid JWT token`);
            return next(new Error("Invalid authentication token"));
        }
        if (!decoded.userId) {
            logger_1.default.warn(`Socket ${socket.id}: JWT token missing userId`);
            return next(new Error("Invalid token payload"));
        }
        // Fetch user from database
        const user = await user_model_1.UserModel.findById(decoded.userId).select("-password");
        if (!user) {
            logger_1.default.warn(`Socket ${socket.id}: User not found for userId ${decoded.userId}`);
            return next(new Error("User not found"));
        }
        // Attach user data to socket
        socket.data.userId = user._id.toString();
        socket.data.user = user.toObject();
        socket.data.isAuthenticated = true;
        socket.data.connectedAt = new Date();
        socket.data.lastActivity = new Date();
        socket.data.rooms = new Set();
        socket.data.rateLimitCount = 0;
        socket.data.rateLimitReset = Date.now() + env_1.config.SOCKETIO.rateLimit.windowMs;
        logger_1.default.info(`Socket ${socket.id}: Authenticated user ${user._id} (${user.email})`);
        next();
    }
    catch (error) {
        logger_1.default.error(`Socket ${socket.id}: Authentication error:`, error);
        next(new Error("Authentication failed"));
    }
};
exports.socketAuthMiddleware = socketAuthMiddleware;
/**
 * Optional authentication middleware - allows unauthenticated connections
 * but still attempts to authenticate if token is provided
 */
const socketOptionalAuthMiddleware = async (socket, next) => {
    try {
        // Extract token from auth header or query params
        const token = socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.replace("Bearer ", "") ||
            socket.handshake.query?.token;
        // Initialize socket data
        socket.data.isAuthenticated = false;
        socket.data.connectedAt = new Date();
        socket.data.lastActivity = new Date();
        socket.data.rooms = new Set();
        socket.data.rateLimitCount = 0;
        socket.data.rateLimitReset = Date.now() + env_1.config.SOCKETIO.rateLimit.windowMs;
        if (!token) {
            logger_1.default.info(`Socket ${socket.id}: Connected without authentication`);
            return next();
        }
        // Try to authenticate if token is provided
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.config.JWT.accessToken.secret);
            if (decoded.userId) {
                const user = await user_model_1.UserModel.findById(decoded.userId).select("-password");
                if (user) {
                    socket.data.userId = user._id.toString();
                    socket.data.user = user.toObject();
                    socket.data.isAuthenticated = true;
                    logger_1.default.info(`Socket ${socket.id}: Optionally authenticated user ${user._id} (${user.email})`);
                }
            }
        }
        catch (jwtError) {
            logger_1.default.warn(`Socket ${socket.id}: Optional authentication failed, continuing as guest`);
        }
        next();
    }
    catch (error) {
        logger_1.default.error(`Socket ${socket.id}: Optional authentication middleware error:`, error);
        // Continue anyway for optional auth
        socket.data.isAuthenticated = false;
        next();
    }
};
exports.socketOptionalAuthMiddleware = socketOptionalAuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map