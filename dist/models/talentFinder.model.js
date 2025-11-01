"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalentFinderModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const talentFinderSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    company: {
        type: String,
        trim: true,
    },
    companySize: {
        type: String,
        enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
    },
    industry: {
        type: String,
        trim: true,
    },
    website: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    location: {
        type: String,
        trim: true,
    },
    isVerifiedCompany: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    collection: "talent_finders",
});
exports.TalentFinderModel = mongoose_1.default.model("TalentFinder", talentFinderSchema);
//# sourceMappingURL=talentFinder.model.js.map