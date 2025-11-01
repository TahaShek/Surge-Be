"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shutdownSocketServer = exports.setSocketServer = exports.getSocketServer = exports.createSocketServer = void 0;
const socket_io_1 = require("socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const env_1 = require("./env");
const logger_1 = __importDefault(require("./logger"));
const connection_1 = require("../queues/connection");
/**
 * Creates and configures Socket.IO server with production-ready settings
 */
const createSocketServer = async (httpServer) => {
    const socketConfig = {
        // CORS configuration for cross-origin requests
        cors: env_1.config.SOCKETIO.cors,
        // Connection settings for reliability
        pingTimeout: env_1.config.SOCKETIO.connection.pingTimeout,
        pingInterval: env_1.config.SOCKETIO.connection.pingInterval,
        maxHttpBufferSize: env_1.config.SOCKETIO.connection.maxPayload,
        // Allow upgrades from polling to WebSocket
        allowUpgrades: true,
        // Transports priority (WebSocket preferred)
        transports: ["websocket", "polling"],
        // Allow EIO3 for compatibility
        allowEIO3: true,
        // HTTP long-polling options
        httpCompression: true,
        // Cookie settings
        cookie: {
            name: "io",
            httpOnly: true,
            sameSite: "strict",
        },
    };
    const io = new socket_io_1.Server(httpServer, socketConfig);
    // Set up Redis adapter for horizontal scaling if enabled
    if (env_1.config.SOCKETIO.redis.enabled) {
        try {
            const redisClient = await (0, connection_1.getRedisConnection)();
            const subClient = redisClient.duplicate();
            // Create Redis adapter for clustering
            const redisAdapter = (0, redis_adapter_1.createAdapter)(redisClient, subClient, {
                key: env_1.config.SOCKETIO.redis.keyPrefix,
            });
            io.adapter(redisAdapter);
            logger_1.default.info("✅ Socket.IO Redis adapter configured for clustering");
        }
        catch (error) {
            logger_1.default.error("❌ Failed to configure Socket.IO Redis adapter:", error);
            throw error;
        }
    }
    // Global error handler
    io.on("connection_error", (error) => {
        logger_1.default.error("Socket.IO connection error:", error);
    });
    logger_1.default.info("✅ Socket.IO server configured successfully");
    return io;
};
exports.createSocketServer = createSocketServer;
/**
 * Socket.IO server instance (singleton)
 */
let socketServer = null;
const getSocketServer = () => {
    if (!socketServer) {
        throw new Error("Socket.IO server not initialized. Call createSocketServer first.");
    }
    return socketServer;
};
exports.getSocketServer = getSocketServer;
const setSocketServer = (server) => {
    socketServer = server;
};
exports.setSocketServer = setSocketServer;
/**
 * Gracefully shutdown Socket.IO server
 */
const shutdownSocketServer = async () => {
    if (socketServer) {
        logger_1.default.info("🛑 Shutting down Socket.IO server...");
        // Close all connections gracefully
        socketServer.close((error) => {
            if (error) {
                logger_1.default.error("Error during Socket.IO shutdown:", error);
            }
            else {
                logger_1.default.info("✅ Socket.IO server shut down successfully");
            }
        });
        socketServer = null;
    }
};
exports.shutdownSocketServer = shutdownSocketServer;
//# sourceMappingURL=socket.js.map