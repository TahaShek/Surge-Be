"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/notifications/notification.route.ts
const express_1 = require("express");
const notification_controller_1 = require("./notification.controller");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/notifications/user
 * @desc    Send notification to a specific user
 * @body    { userId, type, title, message, data }
 */
router.post("/user", notification_controller_1.sendUserNotification);
/**
 * @route   POST /api/notifications/room
 * @desc    Send notification to all users in a room
 * @body    { roomId, type, title, message, data }
 */
router.post("/room", notification_controller_1.sendRoomNotification);
/**
 * @route   POST /api/notifications/announcement
 * @desc    Send system-wide announcement
 * @body    { type, title, message, data }
 */
router.post("/announcement", notification_controller_1.sendSystemAnnouncement);
/**
 * @route   POST /api/notifications/bulk
 * @desc    Send bulk notifications
 * @body    { notifications, batchSize, delayMs }
 */
router.post("/bulk", notification_controller_1.sendBulkNotifications);
/**
 * @route   POST /api/notifications/simulate/:scenario
 * @desc    Simulate notification scenarios for demo
 * @params  scenario (welcome, security, social, system, task)
 */
router.post("/simulate/:scenario", notification_controller_1.simulateNotificationScenarios);
/**
 * @route   GET /api/notifications/analytics
 * @desc    Get notification analytics and statistics
 */
router.get("/analytics", notification_controller_1.getNotificationAnalytics);
exports.default = router;
//# sourceMappingURL=notification.route.js.map