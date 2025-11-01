"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobCandidateModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jobCandidateSchema = new mongoose_1.default.Schema({
    jobId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    talentSeekerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "TalentSeeker",
        required: true,
    },
    status: {
        type: String,
        enum: [
            "applied",
            "shortlisted",
            "accepted",
            "rejected",
            "withdrawn",
            "hired",
        ],
        default: "applied",
    },
    acceptedAt: {
        type: Date,
    },
    rejectedAt: {
        type: Date,
    },
    coverLetter: {
        type: String,
        trim: true,
    },
    appliedAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    notes: {
        type: String,
        trim: true,
    },
    resumeUrl: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
    collection: "job_candidates",
});
// Indexes
jobCandidateSchema.index({ jobId: 1 });
jobCandidateSchema.index({ appliedAt: -1 });
// Unique constraint: a talent seeker can only apply once to a job
jobCandidateSchema.index({ jobId: 1, talentSeekerId: 1 }, { unique: true });
exports.JobCandidateModel = mongoose_1.default.model("JobCandidate", jobCandidateSchema);
//# sourceMappingURL=jobCandidate.model.js.map