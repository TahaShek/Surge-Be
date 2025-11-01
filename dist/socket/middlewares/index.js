"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketPerformanceMiddleware = exports.socketErrorLoggingMiddleware = exports.createEventLoggingMiddleware = exports.socketLoggingMiddleware = exports.socketActivityMiddleware = exports.createEventRateLimit = exports.socketRateLimitMiddleware = exports.socketOptionalAuthMiddleware = exports.socketAuthMiddleware = void 0;
// src/socket/middlewares/index.ts
var auth_middleware_1 = require("./auth.middleware");
Object.defineProperty(exports, "socketAuthMiddleware", { enumerable: true, get: function () { return auth_middleware_1.socketAuthMiddleware; } });
Object.defineProperty(exports, "socketOptionalAuthMiddleware", { enumerable: true, get: function () { return auth_middleware_1.socketOptionalAuthMiddleware; } });
var rateLimit_middleware_1 = require("./rateLimit.middleware");
Object.defineProperty(exports, "socketRateLimitMiddleware", { enumerable: true, get: function () { return rateLimit_middleware_1.socketRateLimitMiddleware; } });
Object.defineProperty(exports, "createEventRateLimit", { enumerable: true, get: function () { return rateLimit_middleware_1.createEventRateLimit; } });
Object.defineProperty(exports, "socketActivityMiddleware", { enumerable: true, get: function () { return rateLimit_middleware_1.socketActivityMiddleware; } });
var logging_middleware_1 = require("./logging.middleware");
Object.defineProperty(exports, "socketLoggingMiddleware", { enumerable: true, get: function () { return logging_middleware_1.socketLoggingMiddleware; } });
Object.defineProperty(exports, "createEventLoggingMiddleware", { enumerable: true, get: function () { return logging_middleware_1.createEventLoggingMiddleware; } });
Object.defineProperty(exports, "socketErrorLoggingMiddleware", { enumerable: true, get: function () { return logging_middleware_1.socketErrorLoggingMiddleware; } });
Object.defineProperty(exports, "socketPerformanceMiddleware", { enumerable: true, get: function () { return logging_middleware_1.socketPerformanceMiddleware; } });
//# sourceMappingURL=index.js.map