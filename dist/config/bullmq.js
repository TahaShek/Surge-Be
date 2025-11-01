"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueueOptions = getQueueOptions;
exports.getWorkerOptions = getWorkerOptions;
const connection_1 = require("../queues/connection");
const env_1 = require("./env");
async function getQueueOptions() {
    const connection = await (0, connection_1.getRedisConnection)();
    return {
        connection,
        prefix: env_1.config.BULLMQ.prefix,
        defaultJobOptions: {
            attempts: Number(env_1.config.BULLMQ.maxRetries),
            backoff: {
                type: "exponential",
                delay: Number(env_1.config.BULLMQ.backoffDelay),
            },
            removeOnComplete: 100, // keep last 100 completed jobs
            removeOnFail: 500, // keep last 500 failed jobs
        },
    };
}
async function getWorkerOptions() {
    const connection = await (0, connection_1.getRedisConnection)();
    return {
        connection,
        concurrency: Number(process.env.WORKER_CONCURRENCY || 5),
    };
}
//# sourceMappingURL=bullmq.js.map