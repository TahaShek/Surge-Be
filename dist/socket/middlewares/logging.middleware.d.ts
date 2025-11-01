import { AuthenticatedSocket, SocketMiddleware } from "../../@types/socket.types";
/**
 * Socket.IO Logging Middleware
 * Logs connection events and user activities
 */
export declare const socketLoggingMiddleware: SocketMiddleware;
/**
 * Middleware to log specific events
 */
export declare const createEventLoggingMiddleware: (eventName: string) => (socket: AuthenticatedSocket, next: (err?: Error) => void) => void;
/**
 * Middleware to log errors
 */
export declare const socketErrorLoggingMiddleware: (socket: AuthenticatedSocket, error: Error, eventName?: string) => void;
/**
 * Performance monitoring middleware
 */
export declare const socketPerformanceMiddleware: SocketMiddleware;
//# sourceMappingURL=logging.middleware.d.ts.map