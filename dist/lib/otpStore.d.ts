import type { Redis } from "ioredis";
export declare function saveOtp(redis: Redis, identifier: string, otp: string): Promise<void>;
export declare function getOtp(redis: Redis, identifier: string): Promise<string | null>;
export declare function deleteOtp(redis: Redis, identifier: string): Promise<void>;
//# sourceMappingURL=otpStore.d.ts.map