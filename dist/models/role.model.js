"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModel = void 0;
const index_types_1 = require("../@types/index.types");
const mongoose_1 = __importDefault(require("mongoose"));
const rolesSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        enum: Object.values(index_types_1.UserRoleEnum),
        required: true,
    },
    description: {
        type: String,
    },
    permissions: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Permission",
        },
    ],
}, { timestamps: true });
exports.RoleModel = mongoose_1.default.model("Role", rolesSchema);
//# sourceMappingURL=role.model.js.map