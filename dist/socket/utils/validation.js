"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAuth = exports.requireAuth = exports.withValidation = exports.validateEventData = exports.socketValidationSchemas = void 0;
// src/socket/utils/validation.ts
const zod_1 = require("zod");
const logger_1 = __importDefault(require("../../config/logger"));
/**
 * Validation schemas for Socket.IO events
 */
exports.socketValidationSchemas = {
    // Room events
    joinRoom: zod_1.z.object({
        roomId: zod_1.z.string().min(1).max(100),
        password: zod_1.z.string().optional(),
    }),
    leaveRoom: zod_1.z.object({
        roomId: zod_1.z.string().min(1).max(100),
    }),
    // Message events
    sendMessage: zod_1.z.object({
        roomId: zod_1.z.string().min(1).max(100),
        content: zod_1.z.string().min(1).max(5000),
        type: zod_1.z.enum(["text", "image", "file"]).optional(),
        metadata: zod_1.z.object({
            fileName: zod_1.z.string().optional(),
            fileSize: zod_1.z.number().optional(),
            mimeType: zod_1.z.string().optional(),
            replyTo: zod_1.z.string().optional(),
        }).optional(),
    }),
    // User status events
    updateStatus: zod_1.z.enum(["online", "away", "busy", "offline"]),
    // Typing events
    typing: zod_1.z.object({
        roomId: zod_1.z.string().min(1).max(100),
    }),
};
/**
 * Validates event data using Zod schemas
 */
const validateEventData = (schema, data, socket, eventName) => {
    try {
        return schema.parse(data);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            logger_1.default.warn(`Socket ${socket.id}: Invalid data for event ${eventName}:`, {
                errors: error.issues,
                data,
                userId: socket.data.userId,
            });
            socket.emit("error", {
                code: "VALIDATION_ERROR",
                message: `Invalid data for ${eventName}`,
                timestamp: Date.now(),
                details: error.issues,
            });
        }
        else {
            logger_1.default.error(`Socket ${socket.id}: Validation error for event ${eventName}:`, error);
            socket.emit("error", {
                code: "VALIDATION_ERROR",
                message: `Validation failed for ${eventName}`,
                timestamp: Date.now(),
            });
        }
        return null;
    }
};
exports.validateEventData = validateEventData;
/**
 * Creates a validation wrapper for event handlers
 */
const withValidation = (schema, handler) => {
    return async (socket, data, ...args) => {
        const validatedData = (0, exports.validateEventData)(schema, data, socket, handler.name || "unknown");
        if (validatedData !== null) {
            await handler(socket, validatedData, ...args);
        }
    };
};
exports.withValidation = withValidation;
/**
 * Validates user authentication
 */
const requireAuth = (socket, eventName) => {
    if (!socket.data.isAuthenticated || !socket.data.userId) {
        logger_1.default.warn(`Socket ${socket.id}: Unauthorized access to ${eventName}`);
        socket.emit("error", {
            code: "UNAUTHORIZED",
            message: `Authentication required for ${eventName}`,
            timestamp: Date.now(),
        });
        return false;
    }
    return true;
};
exports.requireAuth = requireAuth;
/**
 * Creates an authentication wrapper for event handlers
 */
const withAuth = (handler) => {
    return async (socket, ...args) => {
        if ((0, exports.requireAuth)(socket, handler.name || "unknown")) {
            await handler(socket, ...args);
        }
    };
};
exports.withAuth = withAuth;
//# sourceMappingURL=validation.js.map