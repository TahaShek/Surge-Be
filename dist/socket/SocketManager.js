"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketManager = exports.SocketManager = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const socket_1 = require("../config/socket");
const socket_types_1 = require("../@types/socket.types");
const middlewares_1 = require("./middlewares");
const handlers_1 = require("./handlers");
const services_1 = require("./services");
const connection_1 = require("./utils/connection");
const room_1 = require("./utils/room");
/**
 * Socket.IO Manager - Main class that orchestrates all Socket.IO functionality
 */
class SocketManager {
    constructor() {
        this.io = null;
        this.socketService = null;
        this.notificationService = null;
        this.cleanupInterval = null;
    }
    /**
     * Initializes Socket.IO server with all configurations
     */
    async initialize(httpServer) {
        try {
            logger_1.default.info("🔌 Initializing Socket.IO server...");
            // Create Socket.IO server
            this.io = await (0, socket_1.createSocketServer)(httpServer);
            (0, socket_1.setSocketServer)(this.io);
            // Initialize services
            this.socketService = new services_1.SocketService(this.io);
            this.notificationService = new services_1.NotificationService();
            // Set up middlewares
            this.setupMiddlewares();
            // Set up event handlers
            this.setupEventHandlers();
            // Start cleanup tasks
            this.startCleanupTasks();
            logger_1.default.info("✅ Socket.IO server initialized successfully");
        }
        catch (error) {
            logger_1.default.error("❌ Failed to initialize Socket.IO server:", error);
            throw error;
        }
    }
    /**
     * Sets up Socket.IO middlewares
     */
    setupMiddlewares() {
        if (!this.io) {
            throw new Error("Socket.IO server not initialized");
        }
        // Apply middlewares in order
        this.io.use(middlewares_1.socketLoggingMiddleware);
        this.io.use(middlewares_1.socketPerformanceMiddleware);
        this.io.use(middlewares_1.socketRateLimitMiddleware);
        // Use optional auth middleware (allows both authenticated and guest connections)
        this.io.use(middlewares_1.socketOptionalAuthMiddleware);
        logger_1.default.info("✅ Socket.IO middlewares configured");
    }
    /**
     * Sets up Socket.IO event handlers
     */
    setupEventHandlers() {
        if (!this.io) {
            throw new Error("Socket.IO server not initialized");
        }
        this.io.on(socket_types_1.SocketEvents.CONNECTION, (socket) => {
            // Handle initial connection
            (0, handlers_1.handleConnection)(socket);
            // Connection events
            socket.on(socket_types_1.SocketEvents.AUTHENTICATE, (token, callback) => (0, handlers_1.handleAuthentication)(socket, token, callback));
            socket.on(socket_types_1.SocketEvents.PING, (callback) => (0, handlers_1.handlePing)(socket, callback));
            // Room events
            socket.on(socket_types_1.SocketEvents.JOIN_ROOM, (roomId, callback) => (0, handlers_1.handleJoinRoom)(socket, roomId, callback));
            socket.on(socket_types_1.SocketEvents.LEAVE_ROOM, (roomId, callback) => (0, handlers_1.handleLeaveRoom)(socket, roomId, callback));
            // Message events
            socket.on(socket_types_1.SocketEvents.SEND_MESSAGE, (data, callback) => (0, handlers_1.handleSendMessage)(socket, data, callback, () => { }));
            socket.on(socket_types_1.SocketEvents.TYPING_START, (roomId) => (0, handlers_1.handleTypingStart)(socket, { roomId }));
            socket.on(socket_types_1.SocketEvents.TYPING_STOP, (roomId) => (0, handlers_1.handleTypingStop)(socket, { roomId }));
            // User events
            socket.on(socket_types_1.SocketEvents.UPDATE_STATUS, (status) => (0, handlers_1.handleUpdateStatus)(socket, status));
            // Additional events using any type for flexibility
            socket.on("get_room_info", (roomId, callback) => (0, handlers_1.handleGetRoomInfo)(socket, roomId, callback));
            socket.on("list_my_rooms", (callback) => (0, handlers_1.handleListMyRooms)(socket, callback));
            socket.on("get_message_history", (data, callback) => (0, handlers_1.handleGetMessageHistory)(socket, data, callback));
            socket.on("get_online_users", (callback) => (0, handlers_1.handleGetOnlineUsers)(socket, callback));
            socket.on("get_user_profile", (userId, callback) => (0, handlers_1.handleGetUserProfile)(socket, userId, callback));
            socket.on("update_profile", (data, callback) => (0, handlers_1.handleUpdateProfile)(socket, data, callback));
            socket.on("get_server_stats", (callback) => (0, handlers_1.handleGetServerStats)(socket, callback));
            socket.on("search_users", (query, callback) => (0, handlers_1.handleSearchUsers)(socket, query, callback));
            // Disconnect event
            socket.on(socket_types_1.SocketEvents.DISCONNECT, (reason) => (0, handlers_1.handleDisconnect)(socket, reason));
        });
        logger_1.default.info("✅ Socket.IO event handlers configured");
    }
    /**
     * Starts periodic cleanup tasks
     */
    startCleanupTasks() {
        // Run cleanup every 5 minutes
        this.cleanupInterval = setInterval(() => {
            try {
                (0, connection_1.cleanupDisconnectedSockets)();
                (0, room_1.cleanupInactiveRooms)();
                logger_1.default.debug("🧹 Periodic cleanup completed");
            }
            catch (error) {
                logger_1.default.error("Error during cleanup:", error);
            }
        }, 5 * 60 * 1000); // 5 minutes
        logger_1.default.info("✅ Cleanup tasks started");
    }
    /**
     * Gets the Socket.IO server instance
     */
    getServer() {
        if (!this.io) {
            throw new Error("Socket.IO server not initialized");
        }
        return this.io;
    }
    /**
     * Gets the Socket service
     */
    getSocketService() {
        if (!this.socketService) {
            throw new Error("Socket service not initialized");
        }
        return this.socketService;
    }
    /**
     * Gets the Notification service
     */
    getNotificationService() {
        if (!this.notificationService) {
            throw new Error("Notification service not initialized");
        }
        return this.notificationService;
    }
    /**
     * Gracefully shuts down Socket.IO server
     */
    async shutdown() {
        logger_1.default.info("🛑 Shutting down Socket.IO server...");
        try {
            // Stop cleanup tasks
            if (this.cleanupInterval) {
                clearInterval(this.cleanupInterval);
                this.cleanupInterval = null;
            }
            // Shutdown services
            if (this.socketService) {
                await this.socketService.shutdown();
            }
            // Shutdown Socket.IO server
            await (0, socket_1.shutdownSocketServer)();
            this.io = null;
            this.socketService = null;
            this.notificationService = null;
            logger_1.default.info("✅ Socket.IO server shut down successfully");
        }
        catch (error) {
            logger_1.default.error("❌ Error during Socket.IO shutdown:", error);
            throw error;
        }
    }
    /**
     * Broadcasts a message to all connected clients
     */
    broadcast(event, data) {
        if (!this.io) {
            logger_1.default.warn("Cannot broadcast: Socket.IO server not initialized");
            return;
        }
        this.io.emit(event, data);
        logger_1.default.debug(`Broadcasted ${event} to all clients`);
    }
    /**
     * Gets server statistics
     */
    getStats() {
        if (!this.io) {
            return { error: "Socket.IO server not initialized" };
        }
        return {
            connectedSockets: this.io.sockets.sockets.size,
            totalRooms: this.io.sockets.adapter.rooms.size,
            serverUptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
        };
    }
}
exports.SocketManager = SocketManager;
// Export singleton instance
exports.socketManager = new SocketManager();
//# sourceMappingURL=SocketManager.js.map