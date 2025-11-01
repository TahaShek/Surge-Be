"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEvents = exports.UserStatus = void 0;
/**
 * Enum Types
 */
var UserStatus;
(function (UserStatus) {
    UserStatus["ONLINE"] = "online";
    UserStatus["AWAY"] = "away";
    UserStatus["BUSY"] = "busy";
    UserStatus["OFFLINE"] = "offline";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var SocketEvents;
(function (SocketEvents) {
    // Connection
    SocketEvents["CONNECTION"] = "connection";
    SocketEvents["DISCONNECT"] = "disconnect";
    // Authentication
    SocketEvents["AUTHENTICATE"] = "authenticate";
    // Rooms
    SocketEvents["JOIN_ROOM"] = "join_room";
    SocketEvents["LEAVE_ROOM"] = "leave_room";
    SocketEvents["ROOM_JOINED"] = "room_joined";
    SocketEvents["ROOM_LEFT"] = "room_left";
    // Messages
    SocketEvents["SEND_MESSAGE"] = "send_message";
    SocketEvents["ROOM_MESSAGE"] = "room_message";
    // Typing indicators
    SocketEvents["TYPING_START"] = "typing_start";
    SocketEvents["TYPING_STOP"] = "typing_stop";
    // User status
    SocketEvents["UPDATE_STATUS"] = "update_status";
    SocketEvents["USER_ONLINE"] = "user_online";
    SocketEvents["USER_OFFLINE"] = "user_offline";
    // Notifications
    SocketEvents["NOTIFICATION"] = "notification";
    // System
    SocketEvents["ERROR"] = "error";
    SocketEvents["PING"] = "ping";
    SocketEvents["RATE_LIMIT_EXCEEDED"] = "rate_limit_exceeded";
})(SocketEvents || (exports.SocketEvents = SocketEvents = {}));
//# sourceMappingURL=socket.types.js.map