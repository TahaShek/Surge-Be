import { z } from "zod";
import { AuthenticatedSocket } from "../../@types/socket.types";
/**
 * Validation schemas for Socket.IO events
 */
export declare const socketValidationSchemas: {
    joinRoom: z.ZodObject<{
        roomId: z.ZodString;
        password: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    leaveRoom: z.ZodObject<{
        roomId: z.ZodString;
    }, z.core.$strip>;
    sendMessage: z.ZodObject<{
        roomId: z.ZodString;
        content: z.ZodString;
        type: z.ZodOptional<z.ZodEnum<{
            text: "text";
            image: "image";
            file: "file";
        }>>;
        metadata: z.ZodOptional<z.ZodObject<{
            fileName: z.ZodOptional<z.ZodString>;
            fileSize: z.ZodOptional<z.ZodNumber>;
            mimeType: z.ZodOptional<z.ZodString>;
            replyTo: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    updateStatus: z.ZodEnum<{
        offline: "offline";
        online: "online";
        away: "away";
        busy: "busy";
    }>;
    typing: z.ZodObject<{
        roomId: z.ZodString;
    }, z.core.$strip>;
};
/**
 * Validates event data using Zod schemas
 */
export declare const validateEventData: <T>(schema: z.ZodSchema<T>, data: unknown, socket: AuthenticatedSocket, eventName: string) => T | null;
/**
 * Creates a validation wrapper for event handlers
 */
export declare const withValidation: <T>(schema: z.ZodSchema<T>, handler: (socket: AuthenticatedSocket, data: T, ...args: any[]) => void | Promise<void>) => (socket: AuthenticatedSocket, data: unknown, ...args: any[]) => Promise<void>;
/**
 * Validates user authentication
 */
export declare const requireAuth: (socket: AuthenticatedSocket, eventName: string) => boolean;
/**
 * Creates an authentication wrapper for event handlers
 */
export declare const withAuth: (handler: (socket: AuthenticatedSocket, ...args: any[]) => void | Promise<void>) => (socket: AuthenticatedSocket, ...args: any[]) => Promise<void>;
//# sourceMappingURL=validation.d.ts.map