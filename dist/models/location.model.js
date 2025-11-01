"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const locationSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Location name is required"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    latitude: {
        type: Number,
        required: [true, "Latitude is required"],
        min: -90,
        max: 90,
    },
    longitude: {
        type: Number,
        required: [true, "Longitude is required"],
        min: -180,
        max: 180,
    },
    category: {
        type: String,
        enum: ["park", "shop", "attraction", "restaurant", "cafe", "other"],
        default: "other",
    },
    icon: {
        type: String,
        default: "📍",
    },
    metadata: {
        type: mongoose_1.default.Schema.Types.Mixed,
        default: {},
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
    collection: "locations",
});
// Index for geospatial queries
locationSchema.index({ latitude: 1, longitude: 1 });
locationSchema.index({ category: 1 });
locationSchema.index({ isActive: 1 });
exports.LocationModel = mongoose_1.default.model("Location", locationSchema);
//# sourceMappingURL=location.model.js.map