"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const routeSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Route name is required"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    coordinates: [
        {
            latitude: {
                type: Number,
                required: true,
                min: -90,
                max: 90,
            },
            longitude: {
                type: Number,
                required: true,
                min: -180,
                max: 180,
            },
        },
    ],
    color: {
        type: String,
        default: "#3b82f6",
    },
    weight: {
        type: Number,
        default: 4,
        min: 1,
        max: 10,
    },
    distance: {
        type: Number,
        min: 0,
    },
    duration: {
        type: Number,
        min: 0,
    },
    createdBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    collection: "routes",
});
// Indexes
routeSchema.index({ createdBy: 1 });
routeSchema.index({ isActive: 1 });
exports.RouteModel = mongoose_1.default.model("Route", routeSchema);
//# sourceMappingURL=route.model.js.map