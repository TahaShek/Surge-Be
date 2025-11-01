"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationAnalytics = exports.simulateNotificationScenarios = exports.sendBulkNotifications = exports.sendSystemAnnouncement = exports.sendRoomNotification = exports.sendUserNotification = void 0;
const ApiResponse_1 = require("../../utils/ApiResponse");
const asyncHandler_1 = require("../../utils/asyncHandler");
const socket_1 = require("../../socket");
const logger_1 = __importDefault(require("../../config/logger"));
/**
 * Notification Controller - Demonstrates real-world notification use cases
 */
/**
 * Send notification to specific user
 */
exports.sendUserNotification = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId, type, title, message, data } = req.body;
    try {
        const notificationService = socket_1.socketManager.getNotificationService();
        const success = await notificationService.sendToUser(userId, {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: type || 'info',
            title,
            message,
            data
        });
        if (success) {
            logger_1.default.info(`Notification sent to user ${userId}: ${title}`);
            res.status(200).json(new ApiResponse_1.ApiResponse(200, "Notification sent successfully", { sent: true }));
        }
        else {
            res.status(400).json(new ApiResponse_1.ApiResponse(400, "User is offline or notification failed", { sent: false }));
        }
    }
    catch (error) {
        logger_1.default.error("Error sending user notification:", error);
        res.status(500).json(new ApiResponse_1.ApiResponse(500, "Failed to send notification", null));
    }
});
/**
 * Send notification to all users in a room
 */
exports.sendRoomNotification = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { roomId, type, title, message, data } = req.body;
    try {
        const notificationService = socket_1.socketManager.getNotificationService();
        await notificationService.sendToRoom(roomId, {
            id: `room_notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: type || 'info',
            title,
            message,
            data
        });
        logger_1.default.info(`Room notification sent to ${roomId}: ${title}`);
        res.status(200).json(new ApiResponse_1.ApiResponse(200, "Room notification sent successfully", { sent: true }));
    }
    catch (error) {
        logger_1.default.error("Error sending room notification:", error);
        res.status(500).json(new ApiResponse_1.ApiResponse(500, "Failed to send room notification", null));
    }
});
/**
 * Send system-wide announcement
 */
exports.sendSystemAnnouncement = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { type, title, message, data } = req.body;
    try {
        const socketService = socket_1.socketManager.getSocketService();
        await socketService.broadcastAnnouncement(title, message, type || 'info');
        logger_1.default.info(`System announcement sent: ${title}`);
        res.status(200).json(new ApiResponse_1.ApiResponse(200, "System announcement sent successfully", { sent: true }));
    }
    catch (error) {
        logger_1.default.error("Error sending system announcement:", error);
        res.status(500).json(new ApiResponse_1.ApiResponse(500, "Failed to send system announcement", null));
    }
});
/**
 * Send bulk notifications
 */
exports.sendBulkNotifications = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { notifications, batchSize, delayMs } = req.body;
    try {
        const notificationService = socket_1.socketManager.getNotificationService();
        const result = await notificationService.sendBulkNotifications(notifications, batchSize || 50, delayMs || 100);
        logger_1.default.info(`Bulk notifications completed: ${result.success} success, ${result.failed} failed`);
        res.status(200).json(new ApiResponse_1.ApiResponse(200, "Bulk notifications processed", result));
    }
    catch (error) {
        logger_1.default.error("Error sending bulk notifications:", error);
        res.status(500).json(new ApiResponse_1.ApiResponse(500, "Failed to process bulk notifications", null));
    }
});
/**
 * Simulate various notification scenarios for demo purposes
 */
exports.simulateNotificationScenarios = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { scenario } = req.params;
    try {
        const notificationService = socket_1.socketManager.getNotificationService();
        const socketService = socket_1.socketManager.getSocketService();
        switch (scenario) {
            case 'welcome':
                await simulateWelcomeFlow(notificationService);
                break;
            case 'security':
                await simulateSecurityAlerts(notificationService);
                break;
            case 'social':
                await simulateSocialNotifications(notificationService);
                break;
            case 'system':
                await simulateSystemNotifications(socketService);
                break;
            case 'task':
                await simulateTaskNotifications(notificationService);
                break;
            default:
                return res.status(400).json(new ApiResponse_1.ApiResponse(400, "Invalid scenario. Available: welcome, security, social, system, task", null));
        }
        res.status(200).json(new ApiResponse_1.ApiResponse(200, `${scenario} notification scenario executed successfully`, { scenario }));
    }
    catch (error) {
        logger_1.default.error(`Error simulating ${scenario} scenario:`, error);
        res.status(500).json(new ApiResponse_1.ApiResponse(500, `Failed to simulate ${scenario} scenario`, null));
    }
});
/**
 * Get notification analytics
 */
exports.getNotificationAnalytics = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    try {
        const stats = socket_1.socketManager.getStats();
        // In a real application, you'd fetch this from a database
        const analytics = {
            serverStats: stats,
            notificationMetrics: {
                totalSentToday: 1247,
                deliveryRate: 98.5,
                averageResponseTime: '45ms',
                topNotificationTypes: [
                    { type: 'info', count: 856 },
                    { type: 'success', count: 234 },
                    { type: 'warning', count: 123 },
                    { type: 'error', count: 34 }
                ],
                peakHours: '2:00 PM - 4:00 PM',
                mostActiveUsers: [
                    { userId: 'user123', notificationsReceived: 45 },
                    { userId: 'user456', notificationsReceived: 38 },
                    { userId: 'user789', notificationsReceived: 32 }
                ]
            }
        };
        res.status(200).json(new ApiResponse_1.ApiResponse(200, "Notification analytics retrieved successfully", analytics));
    }
    catch (error) {
        logger_1.default.error("Error getting notification analytics:", error);
        res.status(500).json(new ApiResponse_1.ApiResponse(500, "Failed to get notification analytics", null));
    }
});
// Simulation helper functions
async function simulateWelcomeFlow(notificationService) {
    const userId = 'demo-user-123';
    // Welcome notification
    await notificationService.sendSuccess(userId, 'Welcome!', 'Welcome to our platform! Your account has been successfully created.');
    // Tutorial prompt
    setTimeout(async () => {
        await notificationService.sendInfo(userId, 'Getting Started', 'Would you like to take a quick tutorial to learn the basics?', { action: 'start_tutorial', url: '/tutorial' });
    }, 2000);
    // Feature highlight
    setTimeout(async () => {
        await notificationService.sendInfo(userId, 'New Feature', 'Check out our new real-time collaboration tools!', { featureName: 'collaboration', version: '2.1.0' });
    }, 5000);
}
async function simulateSecurityAlerts(notificationService) {
    const userId = 'demo-user-123';
    // Login alert
    await notificationService.sendWarning(userId, 'New Login Detected', 'Someone logged into your account from a new device.', {
        device: 'Chrome on Windows',
        location: 'New York, US',
        timestamp: new Date().toISOString()
    });
    // Suspicious activity
    setTimeout(async () => {
        await notificationService.sendError(userId, 'Suspicious Activity', 'Multiple failed login attempts detected. Account temporarily locked.', { lockDuration: '15 minutes', attemptsCount: 5 });
    }, 3000);
}
async function simulateSocialNotifications(notificationService) {
    const userId = 'demo-user-123';
    // Friend request
    await notificationService.sendInfo(userId, 'Friend Request', 'John Doe sent you a friend request', { type: 'friend_request', senderId: 'john_doe', senderName: 'John Doe' });
    // Post interaction
    setTimeout(async () => {
        await notificationService.sendInfo(userId, 'Post Liked', 'Sarah and 5 others liked your post "Socket.IO Tutorial"', {
            type: 'post_like',
            postId: 'post_123',
            likeCount: 6,
            latestLiker: 'Sarah'
        });
    }, 2000);
    // Mention
    setTimeout(async () => {
        await notificationService.sendInfo(userId, 'You were mentioned', 'Mike mentioned you in #development: "Great work on the API!"', {
            type: 'mention',
            roomId: 'development',
            mentionerId: 'mike',
            messageId: 'msg_456'
        });
    }, 4000);
}
async function simulateSystemNotifications(socketService) {
    // System maintenance
    await socketService.broadcastAnnouncement('Scheduled Maintenance', 'System will undergo maintenance tonight from 2 AM to 4 AM EST.', 'warning');
    // New features
    setTimeout(async () => {
        await socketService.broadcastAnnouncement('New Feature Release', 'We\'ve released new dashboard analytics! Check them out now.', 'success');
    }, 3000);
}
async function simulateTaskNotifications(notificationService) {
    const userId = 'demo-user-123';
    // Task assignment
    await notificationService.sendInfo(userId, 'New Task Assigned', 'You have been assigned to "Fix user authentication bug"', {
        type: 'task_assignment',
        taskId: 'TASK-001',
        assignerId: 'project_manager',
        priority: 'high',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    });
    // Deadline reminder
    setTimeout(async () => {
        await notificationService.sendWarning(userId, 'Task Due Soon', 'Your task "Update documentation" is due in 2 hours', {
            type: 'deadline_reminder',
            taskId: 'TASK-002',
            hoursRemaining: 2
        });
    }, 2000);
    // Task completed
    setTimeout(async () => {
        await notificationService.sendSuccess(userId, 'Task Completed', 'Great job! You completed "Implement user profile" ahead of schedule.', {
            type: 'task_completed',
            taskId: 'TASK-003',
            completedAhead: true
        });
    }, 4000);
}
//# sourceMappingURL=notification.controller.js.map