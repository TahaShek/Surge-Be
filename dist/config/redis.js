"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisOptions = void 0;
const env_1 = require("./env");
exports.redisOptions = {
    host: env_1.config.REDIS.host,
    port: Number(env_1.config.REDIS.port),
    username: env_1.config.REDIS.username,
    password: env_1.config.REDIS.password,
    db: Number(env_1.config.REDIS.db),
    // tls: config.REDIS.tls ? {} : undefined, // enable TLS if set (for cloud)
    // tls: {},
    maxRetriesPerRequest: null, // BullMQ recommended
    enableReadyCheck: true,
    reconnectOnError: (err) => {
        console.warn("[Redis] reconnecting due to error:", err.message);
        return true;
    },
};
//# sourceMappingURL=redis.js.map