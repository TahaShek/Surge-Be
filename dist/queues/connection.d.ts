import { Redis } from "ioredis";
/**
 * Returns a shared Redis connection instance for BullMQ.
 * Waits until Redis is fully ready before resolving.
 */
export declare function getRedisConnection(): Promise<Redis>;
/** Graceful shutdown */
export declare function closeRedisConnection(): Promise<void>;
//# sourceMappingURL=connection.d.ts.map