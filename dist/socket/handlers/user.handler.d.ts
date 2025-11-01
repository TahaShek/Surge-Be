import { AuthenticatedSocket } from "../../@types/socket.types";
/**
 * User event handlers for Socket.IO
 */
/**
 * Handles user status updates
 */
export declare const handleUpdateStatus: (socket: AuthenticatedSocket, ...args: any[]) => Promise<void>;
/**
 * Handles getting online users list
 */
export declare const handleGetOnlineUsers: (socket: AuthenticatedSocket, ...args: any[]) => Promise<void>;
/**
 * Handles getting user profile
 */
export declare const handleGetUserProfile: (socket: AuthenticatedSocket, ...args: any[]) => Promise<void>;
/**
 * Handles updating user profile
 */
export declare const handleUpdateProfile: (socket: AuthenticatedSocket, ...args: any[]) => Promise<void>;
/**
 * Handles getting server statistics (admin only)
 */
export declare const handleGetServerStats: (socket: AuthenticatedSocket, ...args: any[]) => Promise<void>;
/**
 * Handles user search
 */
export declare const handleSearchUsers: (socket: AuthenticatedSocket, ...args: any[]) => Promise<void>;
//# sourceMappingURL=user.handler.d.ts.map