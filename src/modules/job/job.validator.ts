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
    requirements: z.array(z.string()).optional(),
    responsibilities: z.array(z.string()).optional(),
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

// === TYPES ===
export type CreateJobData = z.infer<typeof createJobSchema>["body"];
export type UpdateJobData = z.infer<typeof updateJobSchema>["body"];
export type PublishJobData = z.infer<typeof publishJobSchema>["body"];
export type PublishJobParams = z.infer<typeof publishJobSchema>["params"];
export type GetAllJobsQuery = z.infer<typeof getAllJobsSchema>["query"];

// === GROUPED SCHEMAS ===
export const JobValidator = {
  createJobSchema,
  updateJobSchema,
  publishJobSchema,
  getAllJobsSchema,
};
