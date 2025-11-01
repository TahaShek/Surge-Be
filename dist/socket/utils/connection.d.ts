import { AuthenticatedSocket, ConnectionStats } from "../../@types/socket.types";
/**
 * Tracks a new socket connection
 */
export declare const trackConnection: (socket: AuthenticatedSocket) => void;
/**
 * Tracks a socket disconnection
 */
export declare const trackDisconnection: (socket: AuthenticatedSocket, reason: string) => void;
/**
 * Gets current connection count
 */
export declare const getCurrentConnectionCount: () => number;
/**
 * Gets connection statistics
 */
export declare const getConnectionStats: () => ConnectionStats;
/**
 * Gets all socket IDs for a user
 */
export declare const getUserSocketIds: (userId: string) => string[];
/**
 * Checks if a user is online (has any connected sockets)
 */
export declare const isUserOnline: (userId: string) => boolean;
/**
 * Gets all online users
 */
export declare const getOnlineUsers: () => string[];
/**
 * Broadcasts to all sockets of a specific user
 */
export declare const broadcastToUser: (userId: string, event: string, data: any) => boolean;
/**
 * Broadcasts to all connected sockets
 */
export declare const broadcastToAll: (event: string, data: any, excludeUserId?: string) => void;
/**
 * Broadcasts user online status
 */
export declare const broadcastUserOnline: (userId: string) => void;
/**
 * Broadcasts user offline status
 */
export declare const broadcastUserOffline: (userId: string) => void;
/**
 * Disconnects all sockets for a user
 */
export declare const disconnectUser: (userId: string, reason?: string) => void;
/**
 * Gets detailed connection information
 */
export declare const getConnectionDetails: () => {
    peakConnections: number;
    uptime: {
        ms: number;
        minutes: number;
        formatted: string;
    };
    onlineUsers: string[];
    userConnectionCounts: {
        userId: string;
        socketCount: number;
    }[];
    totalConnections: number;
    authenticatedConnections: number;
    roomCount: number;
    totalRooms: number;
    messagesPerMinute: number;
};
/**
 * Cleanup disconnected sockets (call periodically)
 */
export declare const cleanupDisconnectedSockets: () => void;
//# sourceMappingURL=connection.d.ts.map