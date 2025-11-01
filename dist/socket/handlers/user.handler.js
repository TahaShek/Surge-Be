"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSearchUsers = exports.handleGetServerStats = exports.handleUpdateProfile = exports.handleGetUserProfile = exports.handleGetOnlineUsers = exports.handleUpdateStatus = void 0;
// src/socket/handlers/user.handler.ts
const logger_1 = __importDefault(require("../../config/logger"));
const validation_1 = require("../utils/validation");
const connection_1 = require("../utils/connection");
/**
 * User event handlers for Socket.IO
 */
/**
 * Handles user status updates
 */
exports.handleUpdateStatus = (0, validation_1.withAuth)(async (socket, status) => {
    // Validate status manually
    if (!["online", "away", "busy", "offline"].includes(status)) {
        socket.emit("error", {
            code: "VALIDATION_ERROR",
            message: "Invalid status value",
            timestamp: Date.now(),
        });
        return;
    }
    try {
        const userId = socket.data.userId;
        logger_1.default.info(`User ${userId} updating status to ${status}`);
        // TODO: Update user status in database
        // await UserModel.findByIdAndUpdate(userId, { status });
        // Broadcast status update to all users (excluding the user themselves)
        (0, connection_1.broadcastToAll)("user_updated", {
            userId,
            status,
            timestamp: Date.now(),
        }, userId);
        logger_1.default.info(`User ${userId} status updated to ${status}`);
    }
    catch (error) {
        logger_1.default.error(`Error in handleUpdateStatus:`, error);
        socket.emit("error", {
            code: "STATUS_UPDATE_ERROR",
            message: "Failed to update status",
            timestamp: Date.now(),
        });
    }
});
/**
 * Handles getting online users list
 */
exports.handleGetOnlineUsers = (0, validation_1.withAuth)(async (socket, callback) => {
    try {
        const onlineUserIds = (0, connection_1.getOnlineUsers)();
        // TODO: Fetch user details from database
        // const users = await UserModel.find({ _id: { $in: onlineUserIds } })
        //   .select('name email status avatar')
        //   .lean();
        // For now, return basic user info
        const users = onlineUserIds.map(userId => ({
            id: userId,
            status: "online",
        }));
        callback({
            success: true,
            users,
        });
        logger_1.default.debug(`Returned ${users.length} online users to user ${socket.data.userId}`);
    }
    catch (error) {
        logger_1.default.error(`Error in handleGetOnlineUsers:`, error);
        callback({
            success: false,
            error: "Failed to get online users",
        });
    }
});
/**
 * Handles getting user profile
 */
exports.handleGetUserProfile = (0, validation_1.withAuth)(async (socket, userId, callback) => {
    try {
        // Check if requesting own profile or if user is online
        if (userId !== socket.data.userId && !(0, connection_1.getOnlineUsers)().includes(userId)) {
            callback({
                success: false,
                error: "User not found or offline",
            });
            return;
        }
        // TODO: Fetch user profile from database
        // const user = await UserModel.findById(userId)
        //   .select('name email status avatar bio createdAt')
        //   .lean();
        // For now, return basic info
        const user = {
            id: userId,
            firstName: userId === socket.data.userId ? socket.data.user?.firstName : "Unknown",
            status: "online",
        };
        callback({
            success: true,
            user,
        });
        logger_1.default.debug(`User ${socket.data.userId} requested profile for ${userId}`);
    }
    catch (error) {
        logger_1.default.error(`Error in handleGetUserProfile:`, error);
        callback({
            success: false,
            error: "Failed to get user profile",
        });
    }
});
/**
 * Handles updating user profile
 */
exports.handleUpdateProfile = (0, validation_1.withAuth)(async (socket, data, callback) => {
    try {
        const userId = socket.data.userId;
        const { firstName, bio, avatar } = data;
        // Validate input data
        if (firstName && (firstName.length < 1 || firstName.length > 50)) {
            callback({
                success: false,
                error: "First name must be between 1 and 50 characters",
            });
            return;
        }
        if (bio && bio.length > 500) {
            callback({
                success: false,
                error: "Bio must be less than 500 characters",
            });
            return;
        }
        // TODO: Update user profile in database
        // const updatedUser = await UserModel.findByIdAndUpdate(
        //   userId,
        //   { name, bio, avatar },
        //   { new: true }
        // ).select('name email status bio avatar');
        // Update socket data
        if (socket.data.user) {
            if (firstName)
                socket.data.user.firstName = firstName;
            // Add bio and avatar to user type if needed
        }
        const updatedUser = {
            id: userId,
            firstName: firstName || socket.data.user?.firstName,
            bio,
            avatar,
        };
        callback({
            success: true,
            user: updatedUser,
        });
        // Broadcast user update to others
        (0, connection_1.broadcastToAll)("user_updated", {
            userId,
            firstName: updatedUser.firstName,
            timestamp: Date.now(),
        }, userId);
        logger_1.default.info(`User ${userId} updated their profile`);
    }
    catch (error) {
        logger_1.default.error(`Error in handleUpdateProfile:`, error);
        callback({
            success: false,
            error: "Failed to update profile",
        });
    }
});
/**
 * Handles getting server statistics (admin only)
 */
exports.handleGetServerStats = (0, validation_1.withAuth)(async (socket, callback) => {
    try {
        // TODO: Check if user has admin permissions
        // const user = await UserModel.findById(socket.data.userId);
        // if (!user || user.role !== 'admin') {
        //   callback({
        //     success: false,
        //     error: "Insufficient permissions",
        //   });
        //   return;
        // }
        const stats = (0, connection_1.getConnectionDetails)();
        callback({
            success: true,
            stats,
        });
        logger_1.default.info(`User ${socket.data.userId} requested server stats`);
    }
    catch (error) {
        logger_1.default.error(`Error in handleGetServerStats:`, error);
        callback({
            success: false,
            error: "Failed to get server stats",
        });
    }
});
/**
 * Handles user search
 */
exports.handleSearchUsers = (0, validation_1.withAuth)(async (socket, query, callback) => {
    try {
        if (!query || query.trim().length < 2) {
            callback({
                success: false,
                error: "Search query must be at least 2 characters",
            });
            return;
        }
        // TODO: Implement user search in database
        // const users = await UserModel.find({
        //   $or: [
        //     { name: { $regex: query, $options: 'i' } },
        //     { email: { $regex: query, $options: 'i' } }
        //   ]
        // })
        // .select('name email status avatar')
        // .limit(20)
        // .lean();
        // For now, return empty results
        const users = [];
        callback({
            success: true,
            users,
        });
        logger_1.default.debug(`User ${socket.data.userId} searched for: ${query}`);
    }
    catch (error) {
        logger_1.default.error(`Error in handleSearchUsers:`, error);
        callback({
            success: false,
            error: "Search failed",
        });
    }
});
//# sourceMappingURL=user.handler.js.map