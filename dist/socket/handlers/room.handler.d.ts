import { AuthenticatedSocket } from "../../@types/socket.types";
/**
 * Room event handlers for Socket.IO
 */
/**
 * Handles joining a room
 */
export declare const handleJoinRoom: (socket: AuthenticatedSocket, ...args: any[]) => Promise<void>;
/**
 * Handles leaving a room
 */
export declare const handleLeaveRoom: (socket: AuthenticatedSocket, ...args: any[]) => Promise<void>;
/**
 * Handles getting room information
 */
export declare const handleGetRoomInfo: (socket: AuthenticatedSocket, ...args: any[]) => Promise<void>;
/**
 * Handles listing user's rooms
 */
export declare const handleListMyRooms: (socket: AuthenticatedSocket, ...args: any[]) => Promise<void>;
//# sourceMappingURL=room.handler.d.ts.map