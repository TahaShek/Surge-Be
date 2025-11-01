"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
// src/services/queue.service.ts
const bullmq_1 = require("bullmq");
const connection_1 = require("../queues/connection");
const logger_1 = __importDefault(require("../config/logger"));
class QueueService {
    /** Creates and registers a queue if not already existing */
    static async registerQueue(name) {
        if (!this.queues.has(name)) {
            const connection = await (0, connection_1.getRedisConnection)();
            const queue = new bullmq_1.Queue(name, {
                connection,
                defaultJobOptions: {
                    removeOnComplete: { age: 300, count: 100 }, // remove after 5min or keep max 100
                    removeOnFail: { age: 86400, count: 200 }, // 1 day or max 200
                },
            });
            this.queues.set(name, queue);
        }
        return this.queues.get(name);
    }
    static getQueue(name) {
        return this.queues.get(name);
    }
    /** Start a worker for given queue */
    static async createWorker(name, processor) {
        logger_1.default.info(`[QueueService:CreateWorker}] ✅ Worker creation triggered`);
        const connection = await (0, connection_1.getRedisConnection)();
        const worker = new bullmq_1.Worker(name, processor, { connection, concurrency: 3 });
        worker.on("completed", (job) => logger_1.default.info(`[Worker:${name}] ✅ Job completed: ${job.id}`));
        worker.on("failed", (job, err) => console.error(`[Worker:${name}] ❌ Job failed: ${job?.id} - ${err.message}`));
        logger_1.default.info(`[Worker:${name}] started`);
    }
}
exports.QueueService = QueueService;
QueueService.queues = new Map();
//# sourceMappingURL=queue.service.js.map