"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.config = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
Object.defineProperty(exports, "config", { enumerable: true, get: function () { return env_1.config; } });
const connectDB = async () => {
    try {
        const mongoUri = `${env_1.config.MAIN.mongoUri}/${env_1.config.MAIN.dbName}`;
        const connection = await mongoose_1.default.connect(mongoUri);
        console.log(`✅ MongoDB connected: ${connection.connection.name}`);
        mongoose_1.default.connection.on("disconnected", () => {
            console.warn("⚠️ MongoDB disconnected.");
        });
    }
    catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=index.js.map