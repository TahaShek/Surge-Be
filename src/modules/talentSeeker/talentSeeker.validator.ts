import z from "zod";

// Create/Update TalentSeeker Profile
const createTalentSeekerSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    bio: z.string().max(1000).optional(),
    skills: z.array(z.string()).default([]),
    experience: z.number().min(0).max(50).optional(),
    education: z
      .array(
        z.object({
          degree: z.string().min(1),
          institution: z.string().min(1),
          year: z.number().min(1900).max(2100).optional(),
        })
      )
      .optional(),
    portfolio: z.string().url().optional().or(z.literal("")),
    github: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    resume: z.string().url().optional().or(z.literal("")),
    availability: z.enum(["available", "not-available", "open-to-offers"]).optional(),
    expectedSalary: z
      .object({
        min: z.number().min(0),
        max: z.number().min(0),
        currency: z.string().default("USD"),
      })
      .optional(),
    location: z.string().optional(),
    isOpenToRemote: z.boolean().optional(),
    preferredJobTypes: z
      .array(z.enum(["full-time", "part-time", "contract", "freelance"]))
      .optional(),
  }),
});

const updateTalentSeekerSchema = createTalentSeekerSchema;

// Get TalentSeeker by ID
const getTalentSeekerSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

// === TYPES ===
export type CreateTalentSeekerData = z.infer<typeof createTalentSeekerSchema>["body"];
export type UpdateTalentSeekerData = z.infer<typeof updateTalentSeekerSchema>["body"];
export type GetTalentSeekerParams = z.infer<typeof getTalentSeekerSchema>["params"];

// === GROUPED SCHEMAS ===
export const TalentSeekerValidator = {
  createTalentSeekerSchema,
  updateTalentSeekerSchema,
  getTalentSeekerSchema,
};
