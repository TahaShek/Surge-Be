"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOtpWorker = startOtpWorker;
const otp_service_1 = require("../services/otp.service");
const queue_service_1 = require("../services/queue.service");
async function startOtpWorker() {
    await queue_service_1.QueueService.createWorker("otpQueue", async (job) => {
        const { email, otp, name, verificationUrl } = job.data;
        switch (job.name) {
            case "sendVerificationEmail":
                return await otp_service_1.OtpService.sendTokenVerificationEmail(email, name, verificationUrl);
            case "sendOtp":
                return await otp_service_1.OtpService.processOtpJob(email, otp);
            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    });
}
//# sourceMappingURL=otpWorker.js.map