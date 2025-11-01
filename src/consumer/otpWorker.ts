import { Job } from "bullmq";
import { OtpService } from "services/otp.service";
import { QueueService } from "services/queue.service";

export async function startOtpWorker() {
  await QueueService.createWorker("otpQueue", async (job: Job) => {
    const { email, otp, name, verificationUrl } = job.data;

    switch (job.name) {
      case "sendVerificationEmail":
        return await OtpService.sendTokenVerificationEmail(
          email,
          name,
          verificationUrl
        );
      case "sendOtp":
        return await OtpService.processOtpJob(email, otp);
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  });
}
