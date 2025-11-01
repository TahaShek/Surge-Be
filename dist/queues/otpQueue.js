"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOtpQueue = registerOtpQueue;
const queue_service_1 = require("../services/queue.service");
async function registerOtpQueue() {
    return await queue_service_1.QueueService.registerQueue("otpQueue");
}
//# sourceMappingURL=otpQueue.js.map