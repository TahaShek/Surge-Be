"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = exports.SocketService = exports.SocketManager = exports.socketManager = void 0;
// src/socket/index.ts
var SocketManager_1 = require("./SocketManager");
Object.defineProperty(exports, "socketManager", { enumerable: true, get: function () { return SocketManager_1.socketManager; } });
Object.defineProperty(exports, "SocketManager", { enumerable: true, get: function () { return SocketManager_1.SocketManager; } });
var services_1 = require("./services");
Object.defineProperty(exports, "SocketService", { enumerable: true, get: function () { return services_1.SocketService; } });
Object.defineProperty(exports, "NotificationService", { enumerable: true, get: function () { return services_1.NotificationService; } });
__exportStar(require("./middlewares"), exports);
__exportStar(require("./handlers"), exports);
__exportStar(require("./utils"), exports);
//# sourceMappingURL=index.js.map