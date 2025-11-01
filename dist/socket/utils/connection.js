"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupDisconnectedSockets = exports.getConnectionDetails = exports.disconnectUser = exports.broadcastUserOffline = exports.broadcastUserOnline = exports.broadcastToAll = exports.broadcastToUser = exports.getOnlineUsers = exports.isUserOnline = exports.getUserSocketIds = exports.getConnectionStats = exports.getCurrentConnectionCount = exports.trackDisconnection = exports.trackConnection = void 0;
const logger_1 = __importDefault(require("../../config/logger"));
const socket_1 = require("../../config/socket");
/**
 * Connection management utilities for Socket.IO
 */
// Connection tracking
const connectedUsers = new Map(); // userId -> Set of socketIds
const socketUsers = new Map(); // socketId -> userId
const connectionStats = {
    totalConnections: 0,
    authenticatedConnections: 0,
    peakConnections: 0,
    startTime: Date.now(),
};
/**
 * Tracks a new socket connection
 */
const trackConnection = (socket) => {
    connectionStats.totalConnections++;
    if (socket.data.isAuthenticated && socket.data.userId) {
        connectionStats.authenticatedConnections++;
        // Track user connections
        const userId = socket.data.userId;
        if (!connectedUsers.has(userId)) {
            connectedUsers.set(userId, new Set());
        }
        connectedUsers.get(userId).add(socket.id);
        socketUsers.set(socket.id, userId);
        logger_1.default.info(`User ${userId} connected (${socket.id}). Total sockets for user: ${connectedUsers.get(userId).size}`);
    }
    // Update peak connections
    const currentConnections = (0, exports.getCurrentConnectionCount)();
    if (currentConnections > connectionStats.peakConnections) {
        connectionStats.peakConnections = currentConnections;
    }
    logger_1.default.info(`Socket connected: ${socket.id}. Total connections: ${currentConnections}`);
};
exports.trackConnection = trackConnection;
/**
 * Tracks a socket disconnection
 */
const trackDisconnection = (socket, reason) => {
    connectionStats.totalConnections--;
    const userId = socketUsers.get(socket.id);
    if (userId) {
        connectionStats.authenticatedConnections--;
        // Remove from user connections
        const userSockets = connectedUsers.get(userId);
        if (userSockets) {
            userSockets.delete(socket.id);
            // Remove user if no more connections
            if (userSockets.size === 0) {
                connectedUsers.delete(userId);
                logger_1.default.info(`User ${userId} fully disconnected`);
                // Notify other users that this user went offline
                (0, exports.broadcastUserOffline)(userId);
            }
            else {
                logger_1.default.info(`User ${userId} disconnected one socket (${socket.id}). Remaining sockets: ${userSockets.size}`);
            }
        }
        socketUsers.delete(socket.id);
    }
    logger_1.default.info(`Socket disconnected: ${socket.id} (${reason}). Total connections: ${(0, exports.getCurrentConnectionCount)()}`);
};
exports.trackDisconnection = trackDisconnection;
/**
 * Gets current connection count
 */
const getCurrentConnectionCount = () => {
    try {
        const io = (0, socket_1.getSocketServer)();
        return io.engine.clientsCount;
    }
    catch {
        return connectionStats.totalConnections;
    }
};
exports.getCurrentConnectionCount = getCurrentConnectionCount;
/**
 * Gets connection statistics
 */
const getConnectionStats = () => {
    const io = (0, socket_1.getSocketServer)();
    const currentConnections = (0, exports.getCurrentConnectionCount)();
    return {
        totalConnections: currentConnections,
        authenticatedConnections: connectionStats.authenticatedConnections,
        roomCount: io.sockets.adapter.rooms.size,
        totalRooms: io.sockets.adapter.rooms.size,
        messagesPerMinute: 0, // TODO: Implement message rate tracking
    };
};
exports.getConnectionStats = getConnectionStats;
/**
 * Gets all socket IDs for a user
 */
const getUserSocketIds = (userId) => {
    const userSockets = connectedUsers.get(userId);
    return userSockets ? Array.from(userSockets) : [];
};
exports.getUserSocketIds = getUserSocketIds;
/**
 * Checks if a user is online (has any connected sockets)
 */
const isUserOnline = (userId) => {
    const userSockets = connectedUsers.get(userId);
    return userSockets ? userSockets.size > 0 : false;
};
exports.isUserOnline = isUserOnline;
/**
 * Gets all online users
 */
const getOnlineUsers = () => {
    return Array.from(connectedUsers.keys());
};
exports.getOnlineUsers = getOnlineUsers;
/**
 * Broadcasts to all sockets of a specific user
 */
const broadcastToUser = (userId, event, data) => {
    const socketIds = (0, exports.getUserSocketIds)(userId);
    if (socketIds.length === 0) {
        return false;
    }
    try {
        const io = (0, socket_1.getSocketServer)();
        socketIds.forEach(socketId => {
            io.to(socketId).emit(event, data);
        });
        logger_1.default.debug(`Broadcasted ${event} to user ${userId} (${socketIds.length} sockets)`);
        return true;
    }
    catch (error) {
        logger_1.default.error(`Error broadcasting to user ${userId}:`, error);
        return false;
    }
};
exports.broadcastToUser = broadcastToUser;
/**
 * Broadcasts to all connected sockets
 */
const broadcastToAll = (event, data, excludeUserId) => {
    try {
        const io = (0, socket_1.getSocketServer)();
        if (excludeUserId) {
            const excludeSocketIds = (0, exports.getUserSocketIds)(excludeUserId);
            for (const [socketId, socket] of io.sockets.sockets) {
                if (!excludeSocketIds.includes(socketId)) {
                    socket.emit(event, data);
                }
            }
        }
        else {
            io.emit(event, data);
        }
        logger_1.default.debug(`Broadcasted ${event} to all users`);
    }
    catch (error) {
        logger_1.default.error(`Error broadcasting to all users:`, error);
    }
};
exports.broadcastToAll = broadcastToAll;
/**
 * Broadcasts user online status
 */
const broadcastUserOnline = (userId) => {
    (0, exports.broadcastToAll)("user_online", userId, userId);
};
exports.broadcastUserOnline = broadcastUserOnline;
/**
 * Broadcasts user offline status
 */
const broadcastUserOffline = (userId) => {
    (0, exports.broadcastToAll)("user_offline", userId, userId);
};
exports.broadcastUserOffline = broadcastUserOffline;
/**
 * Disconnects all sockets for a user
 */
const disconnectUser = (userId, reason = "Server disconnect") => {
    const socketIds = (0, exports.getUserSocketIds)(userId);
    if (socketIds.length === 0) {
        return;
    }
    try {
        const io = (0, socket_1.getSocketServer)();
        socketIds.forEach(socketId => {
            const socket = io.sockets.sockets.get(socketId);
            if (socket) {
                socket.disconnect(true);
            }
        });
        logger_1.default.info(`Disconnected user ${userId} (${socketIds.length} sockets): ${reason}`);
    }
    catch (error) {
        logger_1.default.error(`Error disconnecting user ${userId}:`, error);
    }
};
exports.disconnectUser = disconnectUser;
/**
 * Gets detailed connection information
 */
const getConnectionDetails = () => {
    const uptimeMs = Date.now() - connectionStats.startTime;
    const uptimeMinutes = Math.floor(uptimeMs / 60000);
    return {
        ...(0, exports.getConnectionStats)(),
        peakConnections: connectionStats.peakConnections,
        uptime: {
            ms: uptimeMs,
            minutes: uptimeMinutes,
            formatted: formatUptime(uptimeMs),
        },
        onlineUsers: (0, exports.getOnlineUsers)(),
        userConnectionCounts: Array.from(connectedUsers.entries()).map(([userId, sockets]) => ({
            userId,
            socketCount: sockets.size,
        })),
    };
};
exports.getConnectionDetails = getConnectionDetails;
/**
 * Formats uptime in a human-readable way
 */
function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0)
        return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0)
        return `${hours}h ${minutes % 60}m`;
    if (minutes > 0)
        return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}
/**
 * Cleanup disconnected sockets (call periodically)
 */
const cleanupDisconnectedSockets = () => {
    try {
        const io = (0, socket_1.getSocketServer)();
        const activeSockets = new Set(io.sockets.sockets.keys());
        // Clean up socketUsers map
        for (const [socketId, userId] of socketUsers.entries()) {
            if (!activeSockets.has(socketId)) {
                socketUsers.delete(socketId);
                // Remove from user connections
                const userSockets = connectedUsers.get(userId);
                if (userSockets) {
                    userSockets.delete(socketId);
                    if (userSockets.size === 0) {
                        connectedUsers.delete(userId);
                    }
                }
            }
        }
        logger_1.default.debug("Cleaned up disconnected socket references");
    }
    catch (error) {
        logger_1.default.error("Error during socket cleanup:", error);
    }
};
exports.cleanupDisconnectedSockets = cleanupDisconnectedSockets;
//# sourceMappingURL=connection.js.map