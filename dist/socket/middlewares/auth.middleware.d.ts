import { SocketMiddleware } from "../../@types/socket.types";
/**
 * Socket.IO Authentication Middleware
 * Validates JWT token and attaches user to socket
 */
export declare const socketAuthMiddleware: SocketMiddleware;
/**
 * Optional authentication middleware - allows unauthenticated connections
 * but still attempts to authenticate if token is provided
 */
export declare const socketOptionalAuthMiddleware: SocketMiddleware;
//# sourceMappingURL=auth.middleware.d.ts.map