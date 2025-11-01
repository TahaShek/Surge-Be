import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
/**
 * Creates and configures Socket.IO server with production-ready settings
 */
export declare const createSocketServer: (httpServer: HTTPServer) => Promise<SocketIOServer>;
export declare const getSocketServer: () => SocketIOServer;
export declare const setSocketServer: (server: SocketIOServer) => void;
/**
 * Gracefully shutdown Socket.IO server
 */
export declare const shutdownSocketServer: () => Promise<void>;
//# sourceMappingURL=socket.d.ts.map