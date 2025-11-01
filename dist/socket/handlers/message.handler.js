"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetMessageHistory = exports.handleTypingStop = exports.handleTypingStart = exports.handleSendMessage = void 0;
// src/socket/handlers/message.handler.ts
const logger_1 = __importDefault(require("../../config/logger"));
const validation_1 = require("../utils/validation");
const room_1 = require("../utils/room");
const rateLimit_middleware_1 = require("../middlewares/rateLimit.middleware");
// Create rate limiter for messages (max 30 messages per minute)
const messageRateLimit = (0, rateLimit_middleware_1.createEventRateLimit)(30, 60000);
exports.handleSendMessage = (0, validation_1.withAuth)(async (socket, data, callback, next) => {
    // Apply rate limiting
    messageRateLimit(socket, (rateLimitError) => {
        if (rateLimitError) {
            callback({
                success: false,
                error: "Rate limit exceeded. Please slow down.",
            });
            return;
        }
        // Validate message data
        const validatedData = validation_1.socketValidationSchemas.sendMessage.safeParse(data);
        if (!validatedData.success) {
            callback({
                success: false,
                error: "Invalid message data",
            });
            return;
        }
        processSendMessage(socket, validatedData.data, callback);
    });
});
/**
 * Process the actual message sending
 */
async function processSendMessage(socket, data, callback) {
    try {
        const { roomId, content, type = "text", metadata } = data;
        const userId = socket.data.userId;
        const user = socket.data.user;
        logger_1.default.info(`User ${userId} sending message to room ${roomId}`);
        // Check if user is in the room
        if (!(0, room_1.isUserInRoom)(userId, roomId)) {
            callback({
                success: false,
                error: "You are not a member of this room",
            });
            return;
        }
        // Validate message content
        if (!content || content.trim().length === 0) {
            callback({
                success: false,
                error: "Message content cannot be empty",
            });
            return;
        }
        if (content.length > 5000) {
            callback({
                success: false,
                error: "Message too long (max 5000 characters)",
            });
            return;
        }
        // Create message payload
        const message = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            roomId,
            userId,
            username: user.firstName || user.email || "Unknown",
            content: content.trim(),
            timestamp: Date.now(),
            type,
            metadata,
        };
        // TODO: Save message to database
        // await MessageModel.create(message);
        // Broadcast message to room (excluding sender)
        (0, room_1.broadcastToRoom)(roomId, "room_message", message, socket.id);
        // Send confirmation to sender
        callback({
            success: true,
            message,
        });
        logger_1.default.info(`Message sent successfully in room ${roomId} by user ${userId}`);
    }
    catch (error) {
        logger_1.default.error(`Error in processSendMessage:`, error);
        callback({
            success: false,
            error: "Failed to send message",
        });
    }
}
exports.handleTypingStart = (0, validation_1.withAuth)((0, validation_1.withValidation)(validation_1.socketValidationSchemas.typing, async (socket, data) => {
    try {
        const { roomId } = data;
        const userId = socket.data.userId;
        const username = socket.data.user.firstName || socket.data.user.email || "Unknown";
        // Check if user is in the room
        if (!(0, room_1.isUserInRoom)(userId, roomId)) {
            return;
        }
        // Broadcast typing indicator to room (excluding sender)
        (0, room_1.broadcastToRoom)(roomId, "typing_start", {
            userId,
            username,
            roomId,
            timestamp: Date.now(),
        }, socket.id);
        logger_1.default.debug(`User ${userId} started typing in room ${roomId}`);
    }
    catch (error) {
        logger_1.default.error(`Error in handleTypingStart:`, error);
    }
}));
exports.handleTypingStop = (0, validation_1.withAuth)((0, validation_1.withValidation)(validation_1.socketValidationSchemas.typing, async (socket, data) => {
    try {
        const { roomId } = data;
        const userId = socket.data.userId;
        const username = socket.data.user.firstName || socket.data.user.email || "Unknown";
        // Check if user is in the room
        if (!(0, room_1.isUserInRoom)(userId, roomId)) {
            return;
        }
        // Broadcast typing stop to room (excluding sender)
        (0, room_1.broadcastToRoom)(roomId, "typing_stop", {
            userId,
            username,
            roomId,
            timestamp: Date.now(),
        }, socket.id);
        logger_1.default.debug(`User ${userId} stopped typing in room ${roomId}`);
    }
    catch (error) {
        logger_1.default.error(`Error in handleTypingStop:`, error);
    }
}));
exports.handleGetMessageHistory = (0, validation_1.withAuth)(async (socket, data, callback) => {
    try {
        const { roomId, limit = 50, before } = data;
        const userId = socket.data.userId;
        // Check if user is in the room
        if (!(0, room_1.isUserInRoom)(userId, roomId)) {
            callback({
                success: false,
                error: "Access denied to this room",
            });
            return;
        }
        // TODO: Implement database query for message history
        // const messages = await MessageModel.find({
        //   roomId,
        //   timestamp: before ? { $lt: before } : undefined,
        // })
        // .sort({ timestamp: -1 })
        // .limit(limit)
        // .lean();
        // For now, return empty array
        const messages = [];
        callback({
            success: true,
            messages: messages.reverse(), // Return in chronological order
        });
        logger_1.default.debug(`Retrieved ${messages.length} messages for room ${roomId}`);
    }
    catch (error) {
        logger_1.default.error(`Error in handleGetMessageHistory:`, error);
        callback({
            success: false,
            error: "Failed to retrieve message history",
        });
    }
});
//# sourceMappingURL=message.handler.js.map