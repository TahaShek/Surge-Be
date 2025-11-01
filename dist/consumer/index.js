"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../config/logger"));
const otpWorker_1 = require("./otpWorker");
const connection_1 = require("../queues/connection");
const jobWorker_1 = require("./jobWorker");
(async () => {
    await (0, otpWorker_1.startOtpWorker)();
    await (0, jobWorker_1.startJobWorker)();
    logger_1.default.info(`Worker running at process: ${process.pid}`);
    const gracefulShutdown = async (signal) => {
        logger_1.default.info(`🛑 Received ${signal}, shutting down OTP worker...`);
        await (0, connection_1.closeRedisConnection)();
        process.exit(0);
    };
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.once("SIGUSR2", async () => {
        await gracefulShutdown("SIGUSR2");
        process.kill(process.pid, "SIGUSR2"); // Let nodemon actually restart it
    });
})();
//# sourceMappingURL=index.js.map