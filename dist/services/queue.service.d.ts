import { Queue, Processor } from "bullmq";
import type { QueueNames } from "../@types/queues/job.types";
export declare class QueueService {
    private static queues;
    /** Creates and registers a queue if not already existing */
    static registerQueue(name: QueueNames): Promise<Queue>;
    static getQueue(name: QueueNames): Queue | undefined;
    /** Start a worker for given queue */
    static createWorker(name: QueueNames, processor: Processor<any>): Promise<void>;
}
//# sourceMappingURL=queue.service.d.ts.map