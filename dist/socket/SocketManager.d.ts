import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { SocketService, NotificationService } from "./services";
/**
 * Socket.IO Manager - Main class that orchestrates all Socket.IO functionality
 */
export declare class SocketManager {
    private io;
    private socketService;
    private notificationService;
    private cleanupInterval;
    /**
     * Initializes Socket.IO server with all configurations
     */
    initialize(httpServer: HTTPServer): Promise<void>;
    /**
     * Sets up Socket.IO middlewares
     */
    private setupMiddlewares;
    /**
     * Sets up Socket.IO event handlers
     */
    private setupEventHandlers;
    /**
     * Starts periodic cleanup tasks
     */
    private startCleanupTasks;
    /**
     * Gets the Socket.IO server instance
     */
    getServer(): SocketIOServer;
    /**
     * Gets the Socket service
     */
    getSocketService(): SocketService;
    /**
     * Gets the Notification service
     */
    getNotificationService(): NotificationService;
    /**
     * Gracefully shuts down Socket.IO server
     */
    shutdown(): Promise<void>;
    /**
     * Broadcasts a message to all connected clients
     */
    broadcast(event: string, data: any): void;
    /**
     * Gets server statistics
     */
    getStats(): {
        error: string;
        connectedSockets?: undefined;
        totalRooms?: undefined;
        serverUptime?: undefined;
        memoryUsage?: undefined;
    } | {
        connectedSockets: number;
        totalRooms: number;
        serverUptime: number;
        memoryUsage: NodeJS.MemoryUsage;
        error?: undefined;
    };
}
export declare const socketManager: SocketManager;
//# sourceMappingURL=SocketManager.d.ts.map