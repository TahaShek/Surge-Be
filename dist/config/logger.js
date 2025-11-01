"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/config/logger.ts
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logDir = path_1.default.join(__dirname, "../../logs");
// Ensure logs directory exists
if (!fs_1.default.existsSync(logDir)) {
    fs_1.default.mkdirSync(logDir, { recursive: true });
}
// Helper to safely stringify circular structures
const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value))
                return "[Circular]";
            seen.add(value);
        }
        return value;
    };
};
const safeStringify = (data) => {
    try {
        return JSON.stringify(data, getCircularReplacer(), 2);
    }
    catch {
        return String(data);
    }
};
// === Custom formatting ===
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize({ all: true }), winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const msg = stack || message;
    const metaString = Object.keys(meta).length > 0 ? safeStringify(meta) : "";
    return `\n${timestamp} [${level}] ${msg}\n${metaString}`;
}));
const fileFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const msg = stack || message;
    const metaString = Object.keys(meta).length > 0 ? safeStringify(meta) : "";
    return `${timestamp} [${level.toUpperCase()}]: ${msg}\n${metaString}\n`;
}));
const logger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston_1.default.format.errors({ stack: true }),
    transports: [
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, "error.log"),
            level: "error",
            format: fileFormat,
            maxsize: 5 * 1024 * 1024, // 5MB
            maxFiles: 5,
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(logDir, "combined.log"),
            format: fileFormat,
            maxsize: 5 * 1024 * 1024,
            maxFiles: 5,
        }),
    ],
});
// Add console only in development
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston_1.default.transports.Console({
        format: consoleFormat,
    }));
}
exports.default = logger;
//# sourceMappingURL=logger.js.map