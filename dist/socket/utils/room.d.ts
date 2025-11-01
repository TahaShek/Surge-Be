import { AuthenticatedSocket, RoomInfo, RoomMember } from "../../@types/socket.types";
/**
 * Creates a new room
 */
export declare const createRoom: (roomId: string, name: string, type?: "public" | "private" | "direct", metadata?: any) => RoomInfo;
/**
 * Joins a user to a room
 */
export declare const joinRoom: (socket: AuthenticatedSocket, roomId: string) => Promise<boolean>;
/**
 * Removes a user from a room
 */
export declare const leaveRoom: (socket: AuthenticatedSocket, roomId: string) => Promise<boolean>;
/**
 * Removes a user from all rooms (used on disconnect)
 */
export declare const leaveAllRooms: (socket: AuthenticatedSocket) => Promise<void>;
/**
 * Gets room information
 */
export declare const getRoomInfo: (roomId: string) => RoomInfo | null;
/**
 * Gets room members
 */
export declare const getRoomMembers: (roomId: string) => RoomMember[];
/**
 * Gets all rooms a user is in
 */
export declare const getUserRooms: (userId: string) => string[];
/**
 * Broadcasts a message to a room
 */
export declare const broadcastToRoom: (roomId: string, event: string, data: any, excludeSocketId?: string) => void;
/**
 * Checks if a user is in a room
 */
export declare const isUserInRoom: (userId: string, roomId: string) => boolean;
/**
 * Gets room statistics
 */
export declare const getRoomStats: () => {
    totalRooms: number;
    totalMembers: number;
    rooms: RoomInfo[];
};
/**
 * Cleanup inactive rooms (call periodically)
 */
export declare const cleanupInactiveRooms: () => void;
//# sourceMappingURL=room.d.ts.map