import { Server as SocketIOServer } from "socket.io";
import { MessagePayload, NotificationPayload, UserStatus } from "../../@types/socket.types";
/**
 * Socket.IO Service Layer
 * Provides high-level methods for Socket.IO operations
 */
export declare class SocketService {
    private io;
    constructor(io: SocketIOServer);
    /**
     * Sends a message to a specific user
     */
    sendMessageToUser(userId: string, message: string, type?: "info" | "success" | "warning" | "error"): Promise<boolean>;
    /**
     * Sends a notification to a specific user
     */
    sendNotificationToUser(userId: string, notification: Omit<NotificationPayload, "timestamp">): Promise<boolean>;
    /**
     * Broadcasts a message to all users in a room
     */
    sendMessageToRoom(roomId: string, message: MessagePayload, excludeUserId?: string): Promise<void>;
    /**
     * Updates user status and notifies others
     */
    updateUserStatus(userId: string, status: UserStatus): Promise<void>;
    /**
     * Kicks a user from a room
     */
    kickUserFromRoom(roomId: string, userId: string, reason?: string): Promise<boolean>;
    /**
     * Bans a user from the entire socket server
     */
    banUser(userId: string, reason?: string): Promise<void>;
    /**
     * Broadcasts system announcement to all users
     */
    broadcastAnnouncement(title: string, message: string, type?: "info" | "success" | "warning" | "error"): Promise<void>;
    /**
     * Gets server statistics
     */
    getServerStats(): {
        connectedSockets: number;
        onlineUsers: number;
        totalRooms: number;
        serverUptime: number;
    };
    /**
     * Sends typing indicator to room
     */
    sendTypingIndicator(userId: string, roomId: string, isTyping: boolean): Promise<void>;
    /**
     * Creates a direct message room between two users
     */
    createDirectMessageRoom(userId1: string, userId2: string): Promise<string>;
    /**
     * Gracefully shuts down the socket service
     */
    shutdown(): Promise<void>;
}
//# sourceMappingURL=SocketService.d.ts.map