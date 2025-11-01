"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
// src/socket/services/NotificationService.ts
const logger_1 = __importDefault(require("../../config/logger"));
const connection_1 = require("../utils/connection");
const room_1 = require("../utils/room");
/**
 * Notification Service for Socket.IO
 * Handles different types of notifications and delivery methods
 */
class NotificationService {
    /**
     * Sends a notification to a specific user
     */
    async sendToUser(userId, notification) {
        if (!(0, connection_1.isUserOnline)(userId)) {
            logger_1.default.warn(`Cannot send notification to offline user: ${userId}`);
            return false;
        }
        const fullNotification = {
            ...notification,
            timestamp: Date.now(),
            userId,
        };
        const success = (0, connection_1.broadcastToUser)(userId, "notification", fullNotification);
        if (success) {
            logger_1.default.info(`Notification sent to user ${userId}: ${notification.title}`);
        }
        return success;
    }
    /**
     * Sends notification to all users in a room
     */
    async sendToRoom(roomId, notification) {
        const fullNotification = {
            ...notification,
            timestamp: Date.now(),
        };
        (0, room_1.broadcastToRoom)(roomId, "notification", fullNotification);
        logger_1.default.info(`Notification sent to room ${roomId}: ${notification.title}`);
    }
    /**
     * Sends notification to all connected users
     */
    async sendToAll(notification) {
        const fullNotification = {
            ...notification,
            timestamp: Date.now(),
        };
        (0, connection_1.broadcastToAll)("notification", fullNotification);
        logger_1.default.info(`Global notification sent: ${notification.title}`);
    }
    /**
     * Sends notification to multiple specific users
     */
    async sendToUsers(userIds, notification) {
        let successCount = 0;
        for (const userId of userIds) {
            const success = await this.sendToUser(userId, notification);
            if (success) {
                successCount++;
            }
        }
        logger_1.default.info(`Notification sent to ${successCount}/${userIds.length} users: ${notification.title}`);
        return successCount;
    }
    /**
     * Sends a success notification
     */
    async sendSuccess(userId, title, message, data) {
        return this.sendToUser(userId, {
            id: `success_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: "success",
            title,
            message,
            data,
        });
    }
    /**
     * Sends an error notification
     */
    async sendError(userId, title, message, data) {
        return this.sendToUser(userId, {
            id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: "error",
            title,
            message,
            data,
        });
    }
    /**
     * Sends a warning notification
     */
    async sendWarning(userId, title, message, data) {
        return this.sendToUser(userId, {
            id: `warning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: "warning",
            title,
            message,
            data,
        });
    }
    /**
     * Sends an info notification
     */
    async sendInfo(userId, title, message, data) {
        return this.sendToUser(userId, {
            id: `info_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: "info",
            title,
            message,
            data,
        });
    }
    /**
     * Sends system maintenance notification
     */
    async sendMaintenanceNotification(scheduledTime, duration, reason) {
        const notification = {
            id: `maintenance_${Date.now()}`,
            type: "warning",
            title: "Scheduled Maintenance",
            message: `System maintenance scheduled for ${scheduledTime.toLocaleString()}. Expected duration: ${duration}.${reason ? ` Reason: ${reason}` : ""}`,
            data: {
                scheduledTime: scheduledTime.toISOString(),
                duration,
                reason,
            },
        };
        await this.sendToAll(notification);
    }
    /**
     * Sends user mention notification
     */
    async sendMentionNotification(mentionedUserId, mentionerUserId, mentionerName, roomId, messageContent) {
        if (!(0, room_1.isUserInRoom)(mentionedUserId, roomId)) {
            return false;
        }
        return this.sendToUser(mentionedUserId, {
            id: `mention_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: "info",
            title: "You were mentioned",
            message: `${mentionerName} mentioned you: "${messageContent.substring(0, 100)}${messageContent.length > 100 ? "..." : ""}"`,
            data: {
                roomId,
                mentionerUserId,
                mentionerName,
                messageContent,
            },
        });
    }
    /**
     * Sends friend request notification
     */
    async sendFriendRequestNotification(receiverId, senderId, senderName) {
        return this.sendToUser(receiverId, {
            id: `friend_request_${senderId}_${Date.now()}`,
            type: "info",
            title: "New Friend Request",
            message: `${senderName} sent you a friend request`,
            data: {
                senderId,
                senderName,
                type: "friend_request",
            },
        });
    }
    /**
     * Sends room invitation notification
     */
    async sendRoomInvitationNotification(inviteeId, inviterId, inviterName, roomId, roomName) {
        return this.sendToUser(inviteeId, {
            id: `room_invite_${roomId}_${Date.now()}`,
            type: "info",
            title: "Room Invitation",
            message: `${inviterName} invited you to join "${roomName}"`,
            data: {
                inviterId,
                inviterName,
                roomId,
                roomName,
                type: "room_invitation",
            },
        });
    }
    /**
     * Sends security alert notification
     */
    async sendSecurityAlert(userId, alertType, description, ipAddress) {
        return this.sendToUser(userId, {
            id: `security_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: "warning",
            title: "Security Alert",
            message: `${alertType}: ${description}${ipAddress ? ` from IP ${ipAddress}` : ""}`,
            data: {
                alertType,
                description,
                ipAddress,
                timestamp: new Date().toISOString(),
            },
        });
    }
    /**
     * Sends bulk notifications with rate limiting
     */
    async sendBulkNotifications(notifications, batchSize = 50, delayMs = 100) {
        let success = 0;
        let failed = 0;
        for (let i = 0; i < notifications.length; i += batchSize) {
            const batch = notifications.slice(i, i + batchSize);
            const promises = batch.map(async ({ userId, notification }) => {
                try {
                    const result = await this.sendToUser(userId, notification);
                    return result ? "success" : "failed";
                }
                catch (error) {
                    logger_1.default.error(`Error sending notification to user ${userId}:`, error);
                    return "failed";
                }
            });
            const results = await Promise.all(promises);
            results.forEach(result => {
                if (result === "success") {
                    success++;
                }
                else {
                    failed++;
                }
            });
            // Add delay between batches to avoid overwhelming the system
            if (i + batchSize < notifications.length) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
        logger_1.default.info(`Bulk notifications completed: ${success} success, ${failed} failed`);
        return { success, failed };
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=NotificationService.js.map