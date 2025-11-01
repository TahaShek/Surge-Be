import { NotificationPayload } from "../../@types/socket.types";
/**
 * Notification Service for Socket.IO
 * Handles different types of notifications and delivery methods
 */
export declare class NotificationService {
    /**
     * Sends a notification to a specific user
     */
    sendToUser(userId: string, notification: Omit<NotificationPayload, "timestamp">): Promise<boolean>;
    /**
     * Sends notification to all users in a room
     */
    sendToRoom(roomId: string, notification: Omit<NotificationPayload, "timestamp">): Promise<void>;
    /**
     * Sends notification to all connected users
     */
    sendToAll(notification: Omit<NotificationPayload, "timestamp">): Promise<void>;
    /**
     * Sends notification to multiple specific users
     */
    sendToUsers(userIds: string[], notification: Omit<NotificationPayload, "timestamp">): Promise<number>;
    /**
     * Sends a success notification
     */
    sendSuccess(userId: string, title: string, message: string, data?: any): Promise<boolean>;
    /**
     * Sends an error notification
     */
    sendError(userId: string, title: string, message: string, data?: any): Promise<boolean>;
    /**
     * Sends a warning notification
     */
    sendWarning(userId: string, title: string, message: string, data?: any): Promise<boolean>;
    /**
     * Sends an info notification
     */
    sendInfo(userId: string, title: string, message: string, data?: any): Promise<boolean>;
    /**
     * Sends system maintenance notification
     */
    sendMaintenanceNotification(scheduledTime: Date, duration: string, reason?: string): Promise<void>;
    /**
     * Sends user mention notification
     */
    sendMentionNotification(mentionedUserId: string, mentionerUserId: string, mentionerName: string, roomId: string, messageContent: string): Promise<boolean>;
    /**
     * Sends friend request notification
     */
    sendFriendRequestNotification(receiverId: string, senderId: string, senderName: string): Promise<boolean>;
    /**
     * Sends room invitation notification
     */
    sendRoomInvitationNotification(inviteeId: string, inviterId: string, inviterName: string, roomId: string, roomName: string): Promise<boolean>;
    /**
     * Sends security alert notification
     */
    sendSecurityAlert(userId: string, alertType: string, description: string, ipAddress?: string): Promise<boolean>;
    /**
     * Sends bulk notifications with rate limiting
     */
    sendBulkNotifications(notifications: Array<{
        userId: string;
        notification: Omit<NotificationPayload, "timestamp">;
    }>, batchSize?: number, delayMs?: number): Promise<{
        success: number;
        failed: number;
    }>;
}
//# sourceMappingURL=NotificationService.d.ts.map