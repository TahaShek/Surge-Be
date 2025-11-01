"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startJobWorker = startJobWorker;
const job_service_1 = require("../modules/job/job.service");
const queue_service_1 = require("../services/queue.service");
async function startJobWorker() {
    await queue_service_1.QueueService.createWorker("jobQueue", async (job) => {
        const { jobId } = job.data;
        switch (job.name) {
            case "expireJob":
                return await job_service_1.JobService.expireJob(jobId);
            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    });
}
//# sourceMappingURL=jobWorker.js.map