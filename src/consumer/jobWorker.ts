import { Job } from "bullmq";
import { JobService } from "modules/job/job.service";
import { QueueService } from "services/queue.service";

export async function startJobWorker() {
  await QueueService.createWorker("jobQueue", async (job: Job) => {
    const { jobId } = job.data;

    switch (job.name) {
      case "expireJob":
        return await JobService.expireJob(jobId);
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  });
}