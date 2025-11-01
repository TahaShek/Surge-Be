// src/config/socket.ts
import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, ServerOptions } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { config } from "./env";
import logger from "./logger";
import { getRedisConnection } from "../queues/connection";

/**
 * Creates and configures Socket.IO server with production-ready settings
 */
export const createSocketServer = async (httpServer: HTTPServer): Promise<SocketIOServer> => {
  const socketConfig: Partial<ServerOptions> = {
    // ✅ CORS configuration for your FRONTEND
    cors: {
      origin: [
        "http://localhost:5173", // Local development (Vite frontend)
        "http://192.168.1.8:5173", // Local network access (mobile/tablet testing)
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },

    // Connection settings for reliability
    pingTimeout: config.SOCKETIO.connection?.pingTimeout || 60000,
    pingInterval: config.SOCKETIO.connection?.pingInterval || 25000,
    maxHttpBufferSize: config.SOCKETIO.connection?.maxPayload || 1e6,

    // Allow upgrades from polling to WebSocket
    allowUpgrades: true,

    // Transports priority (WebSocket preferred)
    transports: ["websocket", "polling"],

    // Allow EIO3 for compatibility
    allowEIO3: true,

    // HTTP compression enabled
    httpCompression: true,

    // Cookie settings for identification
    cookie: {
      name: "io",
      httpOnly: true,
      sameSite: "strict",
    },
  };

  const io = new SocketIOServer(httpServer, socketConfig);

  // 🧩 Redis adapter for horizontal scaling (optional)
  if (config.SOCKETIO.redis.enabled) {
    try {
      const redisClient = await getRedisConnection();
      const subClient = redisClient.duplicate();

      const redisAdapter = createAdapter(redisClient, subClient, {
        key: config.SOCKETIO.redis.keyPrefix,
      });

      io.adapter(redisAdapter);
      logger.info("✅ Socket.IO Redis adapter configured for clustering");
    } catch (error) {
      logger.error("❌ Failed to configure Socket.IO Redis adapter:", error);
    }
  }

  // Global connection and error handling
  io.on("connection", (socket) => {
    logger.info(`🟢 New socket connected: ${socket.id}`);

    socket.on("disconnect", (reason) => {
      logger.info(`🔴 Socket disconnected (${socket.id}): ${reason}`);
    });
  });

  io.on("connection_error", (error) => {
    logger.error("Socket.IO connection error:", error);
  });

  logger.info("✅ Socket.IO server configured successfully");
  return io;
};

/**
 * Socket.IO server instance (singleton)
 */
let socketServer: SocketIOServer | null = null;

export const getSocketServer = (): SocketIOServer => {
  if (!socketServer) {
    throw new Error("Socket.IO server not initialized. Call createSocketServer first.");
  }
  return socketServer;
};

export const setSocketServer = (server: SocketIOServer): void => {
  socketServer = server;
};

/**
 * Gracefully shutdown Socket.IO server
 */
export const shutdownSocketServer = async (): Promise<void> => {
  if (socketServer) {
    logger.info("🛑 Shutting down Socket.IO server...");
    socketServer.close((error) => {
      if (error) logger.error("Error during Socket.IO shutdown:", error);
      else logger.info("✅ Socket.IO server shut down successfully");
    });
    socketServer = null;
  }
};
