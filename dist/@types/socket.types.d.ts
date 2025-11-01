import { Socket } from "socket.io";
import { IUser } from "./models/user.types";
/**
 * Socket.IO Event Types - Define all events and their payloads
 */
export interface ServerToClientEvents {
    connected: (data: {
        message: string;
        timestamp: number;
    }) => void;
    user_updated: (user: Partial<IUser>) => void;
    user_online: (userId: string) => void;
    user_offline: (userId: string) => void;
    room_joined: (data: {
        roomId: string;
        userId: string;
    }) => void;
    room_left: (data: {
        roomId: string;
        userId: string;
    }) => void;
    room_message: (data: MessagePayload) => void;
    notification: (notification: NotificationPayload) => void;
    error: (error: ErrorPayload) => void;
    rate_limit_exceeded: (data: {
        retryAfter: number;
    }) => void;
}
export interface ClientToServerEvents {
    authenticate: (token: string, callback: (response: AuthResponse) => void) => void;
    join_room: (roomId: string, callback: (response: JoinRoomResponse) => void) => void;
    leave_room: (roomId: string, callback: (response: LeaveRoomResponse) => void) => void;
    send_message: (data: SendMessageData, callback: (response: MessageResponse) => void) => void;
    update_status: (status: UserStatus) => void;
    typing_start: (roomId: string) => void;
    typing_stop: (roomId: string) => void;
    ping: (callback: (response: {
        pong: boolean;
        timestamp: number;
    }) => void) => void;
}
export interface InterServerEvents {
    user_connected: (userId: string, socketId: string) => void;
    user_disconnected: (userId: string, socketId: string) => void;
    broadcast_to_room: (roomId: string, event: string, data: any) => void;
}
export interface SocketData {
    userId?: string;
    user?: IUser;
    rooms: Set<string>;
    isAuthenticated: boolean;
    connectedAt: Date;
    lastActivity: Date;
    rateLimitCount: number;
    rateLimitReset: number;
}
export type AuthenticatedSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
/**
 * Payload Types
 */
export interface MessagePayload {
    id: string;
    roomId: string;
    userId: string;
    username: string;
    content: string;
    timestamp: number;
    type: "text" | "image" | "file" | "system";
    metadata?: {
        fileName?: string;
        fileSize?: number;
        mimeType?: string;
        replyTo?: string;
    };
}
export interface NotificationPayload {
    id: string;
    type: "info" | "success" | "warning" | "error";
    title: string;
    message: string;
    timestamp: number;
    userId?: string;
    data?: any;
}
export interface ErrorPayload {
    code: string;
    message: string;
    timestamp: number;
    details?: any;
}
export interface SendMessageData {
    roomId: string;
    content: string;
    type?: "text" | "image" | "file";
    metadata?: {
        fileName?: string;
        fileSize?: number;
        mimeType?: string;
        replyTo?: string;
    };
}
/**
 * Response Types
 */
export interface AuthResponse {
    success: boolean;
    user?: IUser;
    error?: string;
}
export interface JoinRoomResponse {
    success: boolean;
    roomId?: string;
    error?: string;
}
export interface LeaveRoomResponse {
    success: boolean;
    roomId?: string;
    error?: string;
}
export interface MessageResponse {
    success: boolean;
    message?: MessagePayload;
    error?: string;
}
/**
 * Enum Types
 */
export declare enum UserStatus {
    ONLINE = "online",
    AWAY = "away",
    BUSY = "busy",
    OFFLINE = "offline"
}
export declare enum SocketEvents {
    CONNECTION = "connection",
    DISCONNECT = "disconnect",
    AUTHENTICATE = "authenticate",
    JOIN_ROOM = "join_room",
    LEAVE_ROOM = "leave_room",
    ROOM_JOINED = "room_joined",
    ROOM_LEFT = "room_left",
    SEND_MESSAGE = "send_message",
    ROOM_MESSAGE = "room_message",
    TYPING_START = "typing_start",
    TYPING_STOP = "typing_stop",
    UPDATE_STATUS = "update_status",
    USER_ONLINE = "user_online",
    USER_OFFLINE = "user_offline",
    NOTIFICATION = "notification",
    ERROR = "error",
    PING = "ping",
    RATE_LIMIT_EXCEEDED = "rate_limit_exceeded"
}
/**
 * Rate Limiting Types
 */
export interface RateLimitConfig {
    windowMs: number;
    maxRequests: number;
}
export interface RateLimitInfo {
    count: number;
    resetTime: number;
    limit: number;
}
/**
 * Room Management Types
 */
export interface RoomInfo {
    id: string;
    name: string;
    type: "public" | "private" | "direct";
    memberCount: number;
    createdAt: Date;
    metadata?: any;
}
export interface RoomMember {
    userId: string;
    socketId: string;
    joinedAt: Date;
    role?: "admin" | "moderator" | "member";
}
/**
 * Connection Statistics Types
 */
export interface ConnectionStats {
    totalConnections: number;
    authenticatedConnections: number;
    roomCount: number;
    totalRooms: number;
    messagesPerMinute: number;
}
/**
 * Socket Middleware Types
 */
export type SocketMiddleware = (socket: AuthenticatedSocket, next: (err?: Error) => void) => void;
export interface SocketMiddlewareContext {
    socket: AuthenticatedSocket;
    handshake: any;
    user?: IUser;
}
//# sourceMappingURL=socket.types.d.ts.map