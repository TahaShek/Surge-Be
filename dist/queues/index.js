"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrapQueues = bootstrapQueues;
const otpQueue_1 = require("./otpQueue");
async function bootstrapQueues() {
    await Promise.all([(0, otpQueue_1.registerOtpQueue)(),]);
    console.log("[App] All queues initialized");
}
//# sourceMappingURL=index.js.map