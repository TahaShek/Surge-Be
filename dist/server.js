"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const http_1 = require("http");
const logger_1 = __importDefault(require("./config/logger"));
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const env_1 = require("./config/env");
const connection_1 = require("./queues/connection");
const queues_1 = require("./queues");
const socket_1 = require("./socket");
const startServer = async () => {
    try {
        // 1️⃣ Connect MongoDB
        await (0, config_1.connectDB)();
        // 2️⃣ Connect Redis (shared connection for all queues)
        await (0, connection_1.getRedisConnection)();
        await (0, queues_1.bootstrapQueues)();
        // 3️⃣ Create HTTP server
        const httpServer = (0, http_1.createServer)(app_1.default);
        // 4️⃣ Initialize Socket.IO
        await socket_1.socketManager.initialize(httpServer);
        // 5️⃣ Start HTTP server
        const server = httpServer.listen(env_1.config.MAIN.port, () => {
            logger_1.default.info(`🚀 Server running at http://localhost:${env_1.config.MAIN.port}`);
            logger_1.default.info(`🔌 Socket.IO server running on the same port`);
        });
        // 6️⃣ Graceful shutdown
        process.on("SIGINT", async () => {
            logger_1.default.info("🛑 Gracefully shutting down...");
            // Shutdown Socket.IO first
            await socket_1.socketManager.shutdown();
            // Close HTTP server
            server.close();
            // Close Redis connection
            await (0, connection_1.closeRedisConnection)();
            process.exit(0);
        });
        process.on("SIGTERM", async () => {
            logger_1.default.info("🛑 Received SIGTERM, shutting down...");
            await socket_1.socketManager.shutdown();
            server.close();
            await (0, connection_1.closeRedisConnection)();
            process.exit(0);
        });
    }
    catch (err) {
        logger_1.default.error("❌ Startup failed:", err);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=server.js.map