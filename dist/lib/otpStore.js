"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveOtp = saveOtp;
exports.getOtp = getOtp;
exports.deleteOtp = deleteOtp;
const OTP_PREFIX = "otp:";
const OTP_TTL = 120; // 120 secs
async function saveOtp(redis, identifier, otp) {
    const key = `${OTP_PREFIX}${identifier}`;
    await redis.set(key, otp, "EX", OTP_TTL);
}
async function getOtp(redis, identifier) {
    const key = `${OTP_PREFIX}${identifier}`;
    return await redis.get(key);
}
async function deleteOtp(redis, identifier) {
    const key = `${OTP_PREFIX}${identifier}`;
    await redis.del(key);
}
//# sourceMappingURL=otpStore.js.map