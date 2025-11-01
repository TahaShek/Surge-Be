import { Request, Response } from "express";
/**
 * Notification Controller - Demonstrates real-world notification use cases
 */
/**
 * Send notification to specific user
 */
export declare const sendUserNotification: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Send notification to all users in a room
 */
export declare const sendRoomNotification: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Send system-wide announcement
 */
export declare const sendSystemAnnouncement: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Send bulk notifications
 */
export declare const sendBulkNotifications: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Simulate various notification scenarios for demo purposes
 */
export declare const simulateNotificationScenarios: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * Get notification analytics
 */
export declare const getNotificationAnalytics: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=notification.controller.d.ts.map