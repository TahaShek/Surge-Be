"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalentSeekerModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const talentSeekerSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    title: {
        type: String,
        trim: true,
    },
    bio: {
        type: String,
        trim: true,
    },
    skills: {
        type: [String],
        default: [],
    },
    experience: {
        type: Number, // years
        min: 0,
    },
    education: [
        {
            degree: {
                type: String,
                required: true,
            },
            institution: {
                type: String,
                required: true,
            },
            year: {
                type: Number,
            },
        },
    ],
    portfolio: {
        type: String,
        trim: true,
    },
    github: {
        type: String,
        trim: true,
    },
    linkedin: {
        type: String,
        trim: true,
    },
    resume: {
        type: String,
        trim: true,
    },
    availability: {
        type: String,
        enum: ["available", "not-available", "open-to-offers"],
        default: "available",
    },
    expectedSalary: {
        min: {
            type: Number,
        },
        max: {
            type: Number,
        },
        currency: {
            type: String,
            default: "USD",
        },
    },
    location: {
        type: String,
        trim: true,
    },
    isOpenToRemote: {
        type: Boolean,
        default: false,
    },
    preferredJobTypes: {
        type: [String],
        enum: ["full-time", "part-time", "contract", "freelance"],
        default: [],
    },
}, {
    timestamps: true,
    collection: "talent_seekers",
});
exports.TalentSeekerModel = mongoose_1.default.model("TalentSeeker", talentSeekerSchema);
//# sourceMappingURL=talentSeeker.model.js.map