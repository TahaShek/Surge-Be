export interface EmailJobs {
    sendOtpEmail: {
        email: string;
        otp: string;
    };
}
export type QueueNames = "otpQueue" | "emailQueue" | "jobQueue";
//# sourceMappingURL=job.types.d.ts.map