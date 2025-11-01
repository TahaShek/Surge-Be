"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleListMyRooms = exports.handleGetRoomInfo = exports.handleLeaveRoom = exports.handleJoinRoom = void 0;
// src/socket/handlers/room.handler.ts
const logger_1 = __importDefault(require("../../config/logger"));
const room_1 = require("../utils/room");
const validation_1 = require("../utils/validation");
/**
 * Room event handlers for Socket.IO
 */
/**
 * Handles joining a room
 */
exports.handleJoinRoom = (0, validation_1.withAuth)((0, validation_1.withValidation)(validation_1.socketValidationSchemas.joinRoom, async (socket, data, callback) => {
    try {
        const { roomId, password } = data;
        const userId = socket.data.userId;
        logger_1.default.info(`User ${userId} attempting to join room: ${roomId}`);
        // Check if user is already in the room
        if ((0, room_1.isUserInRoom)(userId, roomId)) {
            callback({
                success: false,
                error: "Already in this room",
            });
            return;
        }
        // TODO: Add room password validation if needed
        // TODO: Add room capacity limits
        // TODO: Add permission checks for private rooms
        const success = await (0, room_1.joinRoom)(socket, roomId);
        if (success) {
            const roomInfo = (0, room_1.getRoomInfo)(roomId);
            const members = (0, room_1.getRoomMembers)(roomId);
            callback({
                success: true,
                roomId,
            });
            // Send room info via notification
            socket.emit("notification", {
                id: `room_info_${roomId}_${Date.now()}`,
                type: "info",
                title: "Room Joined",
                message: `Successfully joined room: ${roomInfo?.name || roomId}`,
                timestamp: Date.now(),
                data: {
                    room: roomInfo,
                    members: members.map(m => ({
                        userId: m.userId,
                        joinedAt: m.joinedAt,
                        role: m.role,
                    })),
                },
            });
            logger_1.default.info(`User ${userId} successfully joined room ${roomId}`);
        }
        else {
            callback({
                success: false,
                error: "Failed to join room",
            });
            logger_1.default.warn(`User ${userId} failed to join room ${roomId}`);
        }
    }
    catch (error) {
        logger_1.default.error(`Error in handleJoinRoom:`, error);
        callback({
            success: false,
            error: "Internal server error",
        });
    }
}));
/**
 * Handles leaving a room
 */
exports.handleLeaveRoom = (0, validation_1.withAuth)((0, validation_1.withValidation)(validation_1.socketValidationSchemas.leaveRoom, async (socket, data, callback) => {
    try {
        const { roomId } = data;
        const userId = socket.data.userId;
        logger_1.default.info(`User ${userId} attempting to leave room: ${roomId}`);
        // Check if user is in the room
        if (!(0, room_1.isUserInRoom)(userId, roomId)) {
            callback({
                success: false,
                error: "Not in this room",
            });
            return;
        }
        const success = await (0, room_1.leaveRoom)(socket, roomId);
        if (success) {
            callback({
                success: true,
                roomId,
            });
            logger_1.default.info(`User ${userId} successfully left room ${roomId}`);
        }
        else {
            callback({
                success: false,
                error: "Failed to leave room",
            });
            logger_1.default.warn(`User ${userId} failed to leave room ${roomId}`);
        }
    }
    catch (error) {
        logger_1.default.error(`Error in handleLeaveRoom:`, error);
        callback({
            success: false,
            error: "Internal server error",
        });
    }
}));
/**
 * Handles getting room information
 */
exports.handleGetRoomInfo = (0, validation_1.withAuth)(async (socket, roomId, callback) => {
    try {
        const userId = socket.data.userId;
        // Check if user has access to this room
        if (!(0, room_1.isUserInRoom)(userId, roomId)) {
            callback({
                success: false,
                error: "Access denied to this room",
            });
            return;
        }
        const roomInfo = (0, room_1.getRoomInfo)(roomId);
        const members = (0, room_1.getRoomMembers)(roomId);
        if (roomInfo) {
            callback({
                success: true,
                room: roomInfo,
                members: members.map(m => ({
                    userId: m.userId,
                    joinedAt: m.joinedAt,
                    role: m.role,
                })),
            });
        }
        else {
            callback({
                success: false,
                error: "Room not found",
            });
        }
    }
    catch (error) {
        logger_1.default.error(`Error in handleGetRoomInfo:`, error);
        callback({
            success: false,
            error: "Internal server error",
        });
    }
});
/**
 * Handles listing user's rooms
 */
exports.handleListMyRooms = (0, validation_1.withAuth)(async (socket, callback) => {
    try {
        const userId = socket.data.userId;
        const userRooms = Array.from(socket.data.rooms);
        const roomDetails = userRooms.map(roomId => {
            const roomInfo = (0, room_1.getRoomInfo)(roomId);
            const members = (0, room_1.getRoomMembers)(roomId);
            return {
                ...roomInfo,
                memberCount: members.length,
            };
        }).filter(Boolean);
        callback({
            success: true,
            rooms: roomDetails,
        });
        logger_1.default.debug(`Listed ${roomDetails.length} rooms for user ${userId}`);
    }
    catch (error) {
        logger_1.default.error(`Error in handleListMyRooms:`, error);
        callback({
            success: false,
            error: "Internal server error",
        });
    }
});
//# sourceMappingURL=room.handler.js.map