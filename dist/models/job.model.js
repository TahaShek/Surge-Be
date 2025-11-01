"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jobSchema = new mongoose_1.default.Schema({
    talentFinderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "TalentFinder",
        required: true,
    },
    jobCode: {
        type: String,
        unique: true,
        immutable: true,
        required: true,
    },
    title: {
        type: String,
        required: [true, "Job title is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Job description is required"],
        trim: true,
    },
    requirements: {
        type: String,
    },
    responsibilities: {
        type: String,
    },
    skills: {
        type: [String],
        default: [],
    },
    jobType: {
        type: String,
        enum: ["full-time", "part-time", "contract", "freelance", "internship"],
        required: true,
    },
    totalPositions: {
        type: Number,
        default: 1,
    },
    experienceLevel: {
        type: String,
        enum: ["entry", "mid", "senior", "lead"],
        required: true,
    },
    location: {
        type: String,
        trim: true,
    },
    jobWorkingType: {
        type: String,
        enum: ["remote", "on-site", "hybrid"],
        default: "remote",
    },
    salary: {
        min: Number,
        max: Number,
        currency: { type: String, default: "USD" },
    },
    benefits: {
        type: [String],
        default: [],
    },
    applicationDeadline: Date,
    status: {
        type: String,
        enum: ["draft", "active", "closed", "filled"],
        default: "draft",
    },
    applicantsCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    publishedAt: { type: Date },
}, {
    timestamps: true,
    collection: "jobs",
});
// Indexes
jobSchema.index({ talentFinderId: 1 });
jobSchema.index({ title: "text", description: "text" });
jobSchema.index({ createdAt: -1 });
// 🔹 Pre-save hook to auto-generate jobCode
jobSchema.pre("validate", async function (next) {
    if (this.jobCode)
        return next(); // Skip if already set
    const lastJob = await mongoose_1.default
        .model("Job")
        .findOne({}, { jobCode: 1 })
        .sort({ createdAt: -1 });
    const lastNumber = lastJob?.jobCode
        ? parseInt(lastJob.jobCode.split("-")[1])
        : 0;
    const newNumber = (lastNumber + 1).toString().padStart(4, "0");
    this.jobCode = `JOB-${newNumber}`;
    next();
});
exports.JobModel = mongoose_1.default.model("Job", jobSchema);
//# sourceMappingURL=job.model.js.map