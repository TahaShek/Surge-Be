"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobValidator = void 0;
const zod_1 = __importDefault(require("zod"));
// Create Job Schema
const createJobSchema = zod_1.default.object({
    body: zod_1.default.object({
        title: zod_1.default.string().min(1, "Job title is required").max(200),
        description: zod_1.default.string().min(1, "Job description is required").max(2000),
        requirements: zod_1.default.string().optional(),
        responsibilities: zod_1.default.string().optional(),
        skills: zod_1.default.array(zod_1.default.string()).default([]),
        jobType: zod_1.default.enum([
            "full-time",
            "part-time",
            "contract",
            "freelance",
            "internship",
        ]),
        experienceLevel: zod_1.default.enum(["entry", "mid", "senior", "lead"]),
        location: zod_1.default.string().optional(),
        jobWorkingType: zod_1.default.enum(["remote", "on-site", "hybrid"]).default("remote"),
        salary: zod_1.default
            .object({
            min: zod_1.default.number().min(0),
            max: zod_1.default.number().min(0),
            currency: zod_1.default.string().default("USD"),
        })
            .optional(),
        benefits: zod_1.default.array(zod_1.default.string()).optional(),
        totalPositions: zod_1.default.number().min(1).default(1),
        // applicationDeadline: z.string().datetime().optional().or(z.date().optional()),
        // status: z.enum(["draft", "active", "closed", "filled"]).default("draft"),
    }),
});
// Update Job Schema
const updateJobSchema = zod_1.default.object({
    body: zod_1.default.object({
        title: zod_1.default.string().min(1).max(200).optional(),
        description: zod_1.default.string().min(1).max(5000).optional(),
        requirements: zod_1.default.string().optional(),
        responsibilities: zod_1.default.string().optional(),
        skills: zod_1.default.array(zod_1.default.string()).optional(),
        jobType: zod_1.default
            .enum(["full-time", "part-time", "contract", "freelance", "internship"])
            .optional(),
        experienceLevel: zod_1.default.enum(["entry", "mid", "senior", "lead"]).optional(),
        location: zod_1.default.string().optional(),
        jobWorkingType: zod_1.default.enum(["remote", "on-site", "hybrid"]).optional(),
        salary: zod_1.default
            .object({
            min: zod_1.default.number().min(0),
            max: zod_1.default.number().min(0),
            currency: zod_1.default.string().default("USD"),
        })
            .optional(),
        benefits: zod_1.default.array(zod_1.default.string()).optional(),
        applicationDeadline: zod_1.default
            .string()
            .datetime()
            .optional()
            .or(zod_1.default.date().optional()),
        status: zod_1.default.enum(["draft", "active", "closed", "filled"]).optional(),
    }),
});
const publishJobSchema = zod_1.default.object({
    params: zod_1.default.object({
        jobId: zod_1.default.string(),
    }),
    body: zod_1.default.object({
        applicationDeadline: zod_1.default
            .string()
            .datetime()
            .optional()
            .or(zod_1.default.date().optional()),
    }),
});
const getAllJobsSchema = zod_1.default.object({
    query: zod_1.default.object({
        page: zod_1.default.string().optional(),
        limit: zod_1.default.string().optional(),
        search: zod_1.default.string().optional(),
        jobType: zod_1.default.string().optional(),
        experienceLevel: zod_1.default.string().optional(),
        location: zod_1.default.string().optional(),
        jobWorkingType: zod_1.default.string().optional(),
        salaryMin: zod_1.default.string().optional(),
        salaryMax: zod_1.default.string().optional(),
        status: zod_1.default
            .string()
            //   .optional()
            //   .transform((val) => {
            //     if (!val) return undefined;
            //     // Handle comma-separated values: "active,draft" -> ["active", "draft"]
            //     const statuses = val.split(",").map((s) => s.trim());
            //     return statuses.length === 1 ? statuses[0] : statuses;
            //   })
            //   .pipe(
            //     z.union([
            //       z.enum(["draft", "active", "closed", "filled"]),
            //       z.array(z.enum(["draft", "active", "closed", "filled"])),
            //     ])
            //   )
            .optional(),
    }),
});
// Apply to Job Schema
const applyToJobSchema = zod_1.default.object({
    params: zod_1.default.object({
        jobId: zod_1.default.string(),
    }),
    body: zod_1.default.object({
        coverLetter: zod_1.default
            .string()
            .min(10, "Cover letter must be at least 10 characters")
            .max(2000, "Cover letter must not exceed 2000 characters")
            .optional(),
    }),
});
const updateApplicationStatusSchema = zod_1.default.object({
    params: zod_1.default.object({
        applicationId: zod_1.default.string(),
    }),
    body: zod_1.default.object({
        status: zod_1.default.enum([
            "applied",
            "shortlisted",
            "accepted",
            "rejected",
            "withdrawn",
            "hired",
        ]),
        notes: zod_1.default
            .string()
            .max(500, "Notes must not exceed 500 characters")
            .optional(),
    }),
});
// AI Feature 1: Enhance Job Description
const enhanceJobDescriptionSchema = zod_1.default.object({
    body: zod_1.default.object({
        title: zod_1.default.string().min(1, "Job title is required"),
        description: zod_1.default.string().min(1, "Job description is required"),
        skills: zod_1.default.array(zod_1.default.string()).default([]),
        jobType: zod_1.default.enum([
            "full-time",
            "part-time",
            "contract",
            "freelance",
            "internship",
        ]),
        experienceLevel: zod_1.default.enum(["entry", "mid", "senior", "lead"]),
        location: zod_1.default.string().optional(),
        responsibilities: zod_1.default.string().optional(),
        requirements: zod_1.default.string().optional(),
    }),
});
// AI Feature 3: Generate Interview Questions
const generateInterviewQuestionsSchema = zod_1.default.object({
    params: zod_1.default.object({
        applicationId: zod_1.default.string(),
    }),
});
// === GROUPED SCHEMAS ===
exports.JobValidator = {
    createJobSchema,
    updateJobSchema,
    publishJobSchema,
    getAllJobsSchema,
    applyToJobSchema,
    updateApplicationStatusSchema,
    enhanceJobDescriptionSchema,
    generateInterviewQuestionsSchema,
};
//# sourceMappingURL=job.validator.js.map