"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupInactiveRooms = exports.getRoomStats = exports.isUserInRoom = exports.broadcastToRoom = exports.getUserRooms = exports.getRoomMembers = exports.getRoomInfo = exports.leaveAllRooms = exports.leaveRoom = exports.joinRoom = exports.createRoom = void 0;
const logger_1 = __importDefault(require("../../config/logger"));
const socket_1 = require("../../config/socket");
/**
 * Room management utilities for Socket.IO
 */
// In-memory storage for room information (consider Redis for production)
const rooms = new Map();
const roomMembers = new Map();
/**
 * Creates a new room
 */
const createRoom = (roomId, name, type = "public", metadata) => {
    const roomInfo = {
        id: roomId,
        name,
        type,
        memberCount: 0,
        createdAt: new Date(),
        metadata,
    };
    rooms.set(roomId, roomInfo);
    roomMembers.set(roomId, new Set());
    logger_1.default.info(`Room created: ${roomId} (${name})`);
    return roomInfo;
};
exports.createRoom = createRoom;
/**
 * Joins a user to a room
 */
const joinRoom = async (socket, roomId) => {
    try {
        // Check if room exists, create if it doesn't
        if (!rooms.has(roomId)) {
            (0, exports.createRoom)(roomId, `Room ${roomId}`);
        }
        // Join the Socket.IO room
        await socket.join(roomId);
        // Add to our room tracking
        const members = roomMembers.get(roomId);
        if (members) {
            const member = {
                userId: socket.data.userId,
                socketId: socket.id,
                joinedAt: new Date(),
                role: "member",
            };
            members.add(member);
            socket.data.rooms.add(roomId);
            // Update room info
            const roomInfo = rooms.get(roomId);
            roomInfo.memberCount = members.size;
            logger_1.default.info(`User ${socket.data.userId} joined room ${roomId}`);
            // Notify other room members
            socket.to(roomId).emit("room_joined", {
                roomId,
                userId: socket.data.userId,
            });
            return true;
        }
        return false;
    }
    catch (error) {
        logger_1.default.error(`Error joining room ${roomId}:`, error);
        return false;
    }
};
exports.joinRoom = joinRoom;
/**
 * Removes a user from a room
 */
const leaveRoom = async (socket, roomId) => {
    try {
        // Leave the Socket.IO room
        await socket.leave(roomId);
        // Remove from our room tracking
        const members = roomMembers.get(roomId);
        if (members) {
            // Find and remove the member
            for (const member of members) {
                if (member.socketId === socket.id) {
                    members.delete(member);
                    break;
                }
            }
            socket.data.rooms.delete(roomId);
            // Update room info
            const roomInfo = rooms.get(roomId);
            if (roomInfo) {
                roomInfo.memberCount = members.size;
                // Delete empty rooms (except system rooms)
                if (members.size === 0 && !roomId.startsWith("system_")) {
                    rooms.delete(roomId);
                    roomMembers.delete(roomId);
                    logger_1.default.info(`Empty room deleted: ${roomId}`);
                }
            }
            logger_1.default.info(`User ${socket.data.userId} left room ${roomId}`);
            // Notify other room members
            socket.to(roomId).emit("room_left", {
                roomId,
                userId: socket.data.userId,
            });
            return true;
        }
        return false;
    }
    catch (error) {
        logger_1.default.error(`Error leaving room ${roomId}:`, error);
        return false;
    }
};
exports.leaveRoom = leaveRoom;
/**
 * Removes a user from all rooms (used on disconnect)
 */
const leaveAllRooms = async (socket) => {
    const userRooms = Array.from(socket.data.rooms);
    for (const roomId of userRooms) {
        await (0, exports.leaveRoom)(socket, roomId);
    }
};
exports.leaveAllRooms = leaveAllRooms;
/**
 * Gets room information
 */
const getRoomInfo = (roomId) => {
    return rooms.get(roomId) || null;
};
exports.getRoomInfo = getRoomInfo;
/**
 * Gets room members
 */
const getRoomMembers = (roomId) => {
    const members = roomMembers.get(roomId);
    return members ? Array.from(members) : [];
};
exports.getRoomMembers = getRoomMembers;
/**
 * Gets all rooms a user is in
 */
const getUserRooms = (userId) => {
    const userRooms = [];
    for (const [roomId, members] of roomMembers.entries()) {
        for (const member of members) {
            if (member.userId === userId) {
                userRooms.push(roomId);
                break;
            }
        }
    }
    return userRooms;
};
exports.getUserRooms = getUserRooms;
/**
 * Broadcasts a message to a room
 */
const broadcastToRoom = (roomId, event, data, excludeSocketId) => {
    try {
        const io = (0, socket_1.getSocketServer)();
        if (excludeSocketId) {
            io.to(roomId).except(excludeSocketId).emit(event, data);
        }
        else {
            io.to(roomId).emit(event, data);
        }
        logger_1.default.debug(`Broadcasted ${event} to room ${roomId}`);
    }
    catch (error) {
        logger_1.default.error(`Error broadcasting to room ${roomId}:`, error);
    }
};
exports.broadcastToRoom = broadcastToRoom;
/**
 * Checks if a user is in a room
 */
const isUserInRoom = (userId, roomId) => {
    const members = roomMembers.get(roomId);
    if (!members)
        return false;
    for (const member of members) {
        if (member.userId === userId) {
            return true;
        }
    }
    return false;
};
exports.isUserInRoom = isUserInRoom;
/**
 * Gets room statistics
 */
const getRoomStats = () => {
    return {
        totalRooms: rooms.size,
        totalMembers: Array.from(roomMembers.values()).reduce((total, members) => total + members.size, 0),
        rooms: Array.from(rooms.values()),
    };
};
exports.getRoomStats = getRoomStats;
/**
 * Cleanup inactive rooms (call periodically)
 */
const cleanupInactiveRooms = () => {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    for (const [roomId, roomInfo] of rooms.entries()) {
        const age = now - roomInfo.createdAt.getTime();
        const members = roomMembers.get(roomId);
        // Delete rooms that are old and empty
        if (age > maxAge && (!members || members.size === 0)) {
            rooms.delete(roomId);
            roomMembers.delete(roomId);
            logger_1.default.info(`Cleaned up inactive room: ${roomId}`);
        }
    }
};
exports.cleanupInactiveRooms = cleanupInactiveRooms;
//# sourceMappingURL=room.js.map