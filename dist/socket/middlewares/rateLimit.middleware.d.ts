import { AuthenticatedSocket, SocketMiddleware } from "../../@types/socket.types";
/**
 * Socket.IO Rate Limiting Middleware
 * Prevents spam and abuse by limiting requests per socket
 */
export declare const socketRateLimitMiddleware: SocketMiddleware;
/**
 * Creates a rate limit middleware for specific events
 */
export declare const createEventRateLimit: (maxRequests: number, windowMs: number) => (socket: AuthenticatedSocket, next: (err?: Error) => void) => void;
/**
 * Middleware to update activity timestamp
 */
export declare const socketActivityMiddleware: SocketMiddleware;
//# sourceMappingURL=rateLimit.middleware.d.ts.map