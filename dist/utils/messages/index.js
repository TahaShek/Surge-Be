"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.t = void 0;
const messages_1 = require("./messages");
const t = (path) => {
    const keys = path.split(".");
    let value = messages_1.MESSAGES;
    for (const key of keys)
        value = value?.[key];
    return value ?? path;
};
exports.t = t;
//# sourceMappingURL=index.js.map