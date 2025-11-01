"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const logger_1 = __importDefault(require("../../config/logger"));
const connection_1 = require("../utils/connection");
const room_1 = require("../utils/room");
/**
 * Socket.IO Service Layer
 * Provides high-level methods for Socket.IO operations
 */
class SocketService {
    constructor(io) {
        this.io = io;
    }
    /**
     * Sends a message to a specific user
     */
    async sendMessageToUser(userId, message, type = "info") {
        if (!(0, connection_1.isUserOnline)(userId)) {
            logger_1.default.warn(`Attempted to send message to offline user: ${userId}`);
            return false;
        }
        const notification = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type,
            title: "Message",
            message,
            timestamp: Date.now(),
            userId,
        };
        return (0, connection_1.broadcastToUser)(userId, "notification", notification);
    }
    /**
     * Sends a notification to a specific user
     */
    async sendNotificationToUser(userId, notification) {
        if (!(0, connection_1.isUserOnline)(userId)) {
            logger_1.default.warn(`Attempted to send notification to offline user: ${userId}`);
            return false;
        }
        const fullNotification = {
            ...notification,
            timestamp: Date.now(),
        };
        return (0, connection_1.broadcastToUser)(userId, "notification", fullNotification);
    }
    /**
     * Broadcasts a message to all users in a room
     */
    async sendMessageToRoom(roomId, message, excludeUserId) {
        const roomInfo = (0, room_1.getRoomInfo)(roomId);
        if (!roomInfo) {
            logger_1.default.warn(`Attempted to send message to non-existent room: ${roomId}`);
            return;
        }
        // Validate that the sender is in the room (if excludeUserId is provided)
        if (excludeUserId && !(0, room_1.isUserInRoom)(excludeUserId, roomId)) {
            logger_1.default.warn(`User ${excludeUserId} attempted to send message to room ${roomId} they're not in`);
            return;
        }
        (0, room_1.broadcastToRoom)(roomId, "room_message", message);
        logger_1.default.info(`Message sent to room ${roomId} by user ${message.userId}`);
    }
    /**
     * Updates user status and notifies others
     */
    async updateUserStatus(userId, status) {
        if (!(0, connection_1.isUserOnline)(userId)) {
            logger_1.default.warn(`Attempted to update status for offline user: ${userId}`);
            return;
        }
        // Update user status in all their sockets
        (0, connection_1.broadcastToUser)(userId, "user_updated", { status });
        // Notify other users about the status change
        (0, connection_1.broadcastToAll)("user_updated", {
            userId,
            status
        }, userId);
        logger_1.default.info(`User ${userId} status updated to ${status}`);
    }
    /**
     * Kicks a user from a room
     */
    async kickUserFromRoom(roomId, userId, reason = "Kicked from room") {
        const roomMembers = (0, room_1.getRoomMembers)(roomId);
        const userInRoom = roomMembers.find(member => member.userId === userId);
        if (!userInRoom) {
            logger_1.default.warn(`Attempted to kick user ${userId} from room ${roomId} they're not in`);
            return false;
        }
        // Disconnect the user's socket from the room
        const userSocket = this.io.sockets.sockets.get(userInRoom.socketId);
        if (userSocket) {
            await userSocket.leave(roomId);
            userSocket.emit("error", {
                code: "KICKED_FROM_ROOM",
                message: reason,
                timestamp: Date.now(),
                details: { roomId, reason },
            });
        }
        // Notify room members
        (0, room_1.broadcastToRoom)(roomId, "room_left", {
            roomId,
            userId,
        });
        logger_1.default.info(`User ${userId} kicked from room ${roomId}: ${reason}`);
        return true;
    }
    /**
     * Bans a user from the entire socket server
     */
    async banUser(userId, reason = "Banned") {
        // Disconnect all user's sockets
        const userSockets = this.io.sockets.sockets;
        for (const [socketId, socket] of userSockets) {
            const authenticatedSocket = socket;
            if (authenticatedSocket.data.userId === userId) {
                authenticatedSocket.emit("error", {
                    code: "USER_BANNED",
                    message: reason,
                    timestamp: Date.now(),
                });
                authenticatedSocket.disconnect(true);
            }
        }
        logger_1.default.info(`User ${userId} banned: ${reason}`);
    }
    /**
     * Broadcasts system announcement to all users
     */
    async broadcastAnnouncement(title, message, type = "info") {
        const announcement = {
            id: `announcement_${Date.now()}`,
            type,
            title,
            message,
            timestamp: Date.now(),
        };
        (0, connection_1.broadcastToAll)("notification", announcement);
        logger_1.default.info(`System announcement broadcasted: ${title}`);
    }
    /**
     * Gets server statistics
     */
    getServerStats() {
        return {
            connectedSockets: this.io.sockets.sockets.size,
            onlineUsers: (0, connection_1.getOnlineUsers)().length,
            totalRooms: this.io.sockets.adapter.rooms.size,
            serverUptime: process.uptime(),
        };
    }
    /**
     * Sends typing indicator to room
     */
    async sendTypingIndicator(userId, roomId, isTyping) {
        if (!(0, room_1.isUserInRoom)(userId, roomId)) {
            return;
        }
        const event = isTyping ? "typing_start" : "typing_stop";
        (0, room_1.broadcastToRoom)(roomId, event, {
            userId,
            roomId,
            timestamp: Date.now(),
        });
    }
    /**
     * Creates a direct message room between two users
     */
    async createDirectMessageRoom(userId1, userId2) {
        // Create a deterministic room ID for DM
        const roomId = `dm_${[userId1, userId2].sort().join("_")}`;
        // Check if both users are online
        if (!(0, connection_1.isUserOnline)(userId1) || !(0, connection_1.isUserOnline)(userId2)) {
            throw new Error("Both users must be online to create DM room");
        }
        logger_1.default.info(`Created DM room ${roomId} for users ${userId1} and ${userId2}`);
        return roomId;
    }
    /**
     * Gracefully shuts down the socket service
     */
    async shutdown() {
        logger_1.default.info("Shutting down Socket.IO service...");
        // Notify all connected users
        (0, connection_1.broadcastToAll)("notification", {
            id: `shutdown_${Date.now()}`,
            type: "warning",
            title: "Server Maintenance",
            message: "Server is shutting down for maintenance. Please reconnect in a few minutes.",
            timestamp: Date.now(),
        });
        // Wait a bit for the message to be delivered
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Disconnect all sockets
        this.io.disconnectSockets(true);
        logger_1.default.info("Socket.IO service shutdown complete");
    }
}
exports.SocketService = SocketService;
//# sourceMappingURL=SocketService.js.map