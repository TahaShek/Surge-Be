import { AuthenticatedSocket } from "../../@types/socket.types";
export declare const handleConnection: (socket: AuthenticatedSocket) => void;
export declare const handleDisconnect: (socket: AuthenticatedSocket, reason: string) => Promise<void>;
export declare const handleConnectionError: (error: Error) => void;
export declare const handleAuthentication: (socket: AuthenticatedSocket, token: string, callback: (response: {
    success: boolean;
    user?: any;
    error?: string;
}) => void) => Promise<void>;
export declare const handlePing: (socket: AuthenticatedSocket, callback: (response: {
    pong: boolean;
    timestamp: number;
}) => void) => void;
//# sourceMappingURL=connection.handler.d.ts.map