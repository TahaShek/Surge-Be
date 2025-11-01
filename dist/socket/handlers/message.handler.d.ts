import { AuthenticatedSocket } from "../../@types/socket.types";
export declare const handleSendMessage: (socket: AuthenticatedSocket, ...args: any[]) => Promise<void>;
export declare const handleTypingStart: (socket: AuthenticatedSocket, ...args: any[]) => Promise<void>;
export declare const handleTypingStop: (socket: AuthenticatedSocket, ...args: any[]) => Promise<void>;
export declare const handleGetMessageHistory: (socket: AuthenticatedSocket, ...args: any[]) => Promise<void>;
//# sourceMappingURL=message.handler.d.ts.map