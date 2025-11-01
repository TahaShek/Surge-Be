"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const routes_1 = __importDefault(require("./routes"));
const logger_1 = __importDefault(require("./config/logger"));
const errorHandler_1 = require("./middlewares/errorHandler");
const ApiResponse_1 = require("./utils/ApiResponse");
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ], // Your React/Vite app
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true, // Important for cookies
    optionsSuccessStatus: 200,
}));
app.use(express_1.default.json({
    limit: "1MB",
}));
app.use((0, cookie_parser_1.default)());
// Morgan + Winston logging
const stream = {
    write: (message) => logger_1.default.info(message.trim()),
};
app.use((0, morgan_1.default)("combined", { stream }));
// Root route
app.get("/", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Mery Karan Arjun",
        environment: env_1.config.MAIN.nodeEnv,
    });
});
// Health check
app.get("/health", (req, res) => {
    res.status(200).json({
        statusCode: 200,
        status: "OK",
        message: "Server is healthy and running smoothly.",
        environment: env_1.config.MAIN.nodeEnv,
        uptime: `${process.uptime().toFixed(2)} seconds`,
        timestamp: new Date().toISOString(),
        memoryUsage: {
            rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
            heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
        },
        pid: process.pid,
        version: process.env.npm_package_version || "unknown",
    });
});
// Socket.IO status endpoint
app.get("/socket-status", (req, res) => {
    try {
        // Import socketManager dynamically to avoid circular dependency
        const { socketManager } = require("./socket");
        const stats = socketManager.getStats();
        res.status(200).json({
            statusCode: 200,
            status: "OK",
            message: "Socket.IO server status",
            data: stats,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        res.status(503).json({
            statusCode: 503,
            status: "ERROR",
            message: "Socket.IO server not available",
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
        });
    }
});
// API routes
app.use(env_1.config.API.prefix, routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json(new ApiResponse_1.ApiResponse(404, "Route not found"));
});
// Global error handler
app.use(errorHandler_1.ErrorMiddleware);
exports.default = app;
//# sourceMappingURL=app.js.map