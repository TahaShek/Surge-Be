import z from "zod";

// Create Job Schema
const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Job title is required").max(200),
    description: z.string().min(1, "Job description is required").max(2000),
    requirements: z.string().optional(),
    responsibilities: z.string().optional(),
    skills: z.array(z.string()).default([]),
    jobType: z.enum([
      "full-time",
      "part-time",
      "contract",
      "freelance",
      "internship",
    ]),
    experienceLevel: z.enum(["entry", "mid", "senior", "lead"]),
    location: z.string().optional(),
    jobWorkingType: z.enum(["remote", "on-site", "hybrid"]).default("remote"),
    salary: z
      .object({
        min: z.number().min(0),
        max: z.number().min(0),
        currency: z.string().default("USD"),
      })
      .optional(),
    benefits: z.array(z.string()).optional(),
    totalPositions: z.number().min(1).default(1),
    // applicationDeadline: z.string().datetime().optional().or(z.date().optional()),
    // status: z.enum(["draft", "active", "closed", "filled"]).default("draft"),
  }),
});

// Update Job Schema
const updateJobSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().min(1).max(5000).optional(),
    requirements: z.string().optional(),
    responsibilities: z.string().optional(),
    skills: z.array(z.string()).optional(),
    jobType: z
      .enum(["full-time", "part-time", "contract", "freelance", "internship"])
      .optional(),
    experienceLevel: z.enum(["entry", "mid", "senior", "lead"]).optional(),
    location: z.string().optional(),
    jobWorkingType: z.enum(["remote", "on-site", "hybrid"]).optional(),
    salary: z
      .object({
        min: z.number().min(0),
        max: z.number().min(0),
        currency: z.string().default("USD"),
      })
      .optional(),
    benefits: z.array(z.string()).optional(),
    applicationDeadline: z
      .string()
      .datetime()
      .optional()
      .or(z.date().optional()),
    status: z.enum(["draft", "active", "closed", "filled"]).optional(),
  }),
});

const publishJobSchema = z.object({
  params: z.object({
    jobId: z.string(),
  }),
  body: z.object({
    applicationDeadline: z
      .string()
      .datetime()
      .optional()
      .or(z.date().optional()),
  }),
});

const getAllJobsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    jobType: z.string().optional(),
    experienceLevel: z.string().optional(),
    location: z.string().optional(),
    jobWorkingType: z.string().optional(),
    salaryMin: z.string().optional(),
    salaryMax: z.string().optional(),
    status: z
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
const applyToJobSchema = z.object({
  params: z.object({
    jobId: z.string(),
  }),
  body: z.object({
    coverLetter: z
      .string()
      .min(10, "Cover letter must be at least 10 characters")
      .max(2000, "Cover letter must not exceed 2000 characters")
      .optional(),
  }),
});

const updateApplicationStatusSchema = z.object({
  params: z.object({
    applicationId: z.string(),
  }),
  body: z.object({
    status: z.enum([
      "applied",
      "shortlisted",
      "accepted",
      "rejected",
      "withdrawn",
      "hired",
    ]),
    notes: z
      .string()
      .max(500, "Notes must not exceed 500 characters")
      .optional(),
  }),
});

// AI Feature 1: Enhance Job Description
const enhanceJobDescriptionSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Job title is required"),
    description: z.string().min(1, "Job description is required"),
    skills: z.array(z.string()).default([]),
    jobType: z.enum([
      "full-time",
      "part-time",
      "contract",
      "freelance",
      "internship",
    ]),
    experienceLevel: z.enum(["entry", "mid", "senior", "lead"]),
    location: z.string().optional(),
    responsibilities: z.string().optional(),
    requirements: z.string().optional(),
  }),
});

// AI Feature 3: Generate Interview Questions
const generateInterviewQuestionsSchema = z.object({
  params: z.object({
    applicationId: z.string(),
  }),
});

// === TYPES ===
export type CreateJobData = z.infer<typeof createJobSchema>["body"];
export type UpdateJobData = z.infer<typeof updateJobSchema>["body"];
export type PublishJobData = z.infer<typeof publishJobSchema>["body"];
export type PublishJobParams = z.infer<typeof publishJobSchema>["params"];
export type GetAllJobsQuery = z.infer<typeof getAllJobsSchema>["query"];
export type ApplyToJobData = z.infer<typeof applyToJobSchema>["body"];
export type ApplyToJobParams = z.infer<typeof applyToJobSchema>["params"];
export type UpdateApplicationStatusData = z.infer<
  typeof updateApplicationStatusSchema
>["body"];
export type UpdateApplicationStatusParams = z.infer<
  typeof updateApplicationStatusSchema
>["params"];
export type EnhanceJobDescriptionData = z.infer<
  typeof enhanceJobDescriptionSchema
>["body"];

// === GROUPED SCHEMAS ===
export const JobValidator = {
  createJobSchema,
  updateJobSchema,
  publishJobSchema,
  getAllJobsSchema,
  applyToJobSchema,
  updateApplicationStatusSchema,
  enhanceJobDescriptionSchema,
  generateInterviewQuestionsSchema,
};
