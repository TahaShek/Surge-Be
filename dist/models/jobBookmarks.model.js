"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobBookmarksModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jobBookmarksSchema = new mongoose_1.default.Schema({
    jobId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    talentSeekrId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "TalentSeekr",
        required: true,
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true, collection: "job_bookmarks" });
exports.JobBookmarksModel = mongoose_1.default.model("JobBookmark", jobBookmarksSchema);
//# sourceMappingURL=jobBookmarks.model.js.map