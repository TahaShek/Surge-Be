"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const permissionsSchema = new mongoose_1.default.Schema({
    module: {
        type: String,
        required: true,
        trim: true,
    },
    actions: {
        create: { type: Boolean, default: false },
        read: { type: Boolean, default: false },
        update: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
    },
    conditions: {
        ownedOnly: { type: Boolean, default: false },
        orgRestricted: { type: Boolean, default: false },
    },
}, {
    timestamps: true,
});
exports.PermissionModel = mongoose_1.default.model("Permission", permissionsSchema);
//# sourceMappingURL=permissions.model.js.map