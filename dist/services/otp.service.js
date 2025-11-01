"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
const crypto_1 = require("crypto");
const otpStore_1 = require("../lib/otpStore");
const connection_1 = require("../queues/connection");
const queue_service_1 = require("./queue.service");
const logger_1 = __importDefault(require("../config/logger"));
const email_service_1 = require("./email.service");
exports.OtpService = {
    async generateOtp(identifier) {
        const otp = (0, crypto_1.randomInt)(100000, 999999).toString();
        const redis = await (0, connection_1.getRedisConnection)();
        // Save OTP in Redis
        await (0, otpStore_1.saveOtp)(redis, identifier, otp);
        return otp;
    },
    async getOtp(identifier) {
        const redis = await (0, connection_1.getRedisConnection)();
        const otp = await (0, otpStore_1.getOtp)(redis, identifier);
        return otp;
    },
    async deleteOtp(identifier) {
        const redis = await (0, connection_1.getRedisConnection)();
        await (0, otpStore_1.deleteOtp)(redis, identifier);
    },
    async sendOtp(email) {
        const otp = await this.generateOtp(email);
        const queue = await queue_service_1.QueueService.registerQueue("otpQueue");
        await queue.add("sendOtp", { email, otp });
        logger_1.default.info(`[OtpService] Job queued for ${email} with OTP ${otp}`);
    },
    async processOtpJob(email, otp) {
        await email_service_1.EmailService.sendMail(email, "Your OTP Code", `Your OTP is ${otp}`);
        logger_1.default.info(`[OtpService] Sending OTP ${otp} to ${email}`);
        return true;
    },
    async sendTokenVerificationEmail(email, name, verificationUrl) {
        await email_service_1.EmailService.sendVerificationEmail(email, name, verificationUrl);
    }
};
//# sourceMappingURL=otp.service.js.map