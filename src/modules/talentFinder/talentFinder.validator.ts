import z from "zod";

// Create/Update TalentFinder Profile
const createTalentFinderSchema = z.object({
  body: z.object({
    company: z.string().min(1, "Company name is required").max(200),
    companySize: z
      .enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"])
      .optional(),
    industry: z.string().min(1).max(100).optional(),
    website: z.string().url().optional().or(z.literal("")),
    description: z.string().max(2000).optional(),
    location: z.string().optional(),
  }),
});

const updateTalentFinderSchema = z.object({
  body: z.object({
    company: z.string().min(1).max(200).optional(),
    companySize: z
      .enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"])
      .optional(),
    industry: z.string().min(1).max(100).optional(),
    website: z.string().url().optional().or(z.literal("")),
    description: z.string().max(2000).optional(),
    location: z.string().optional(),
  }),
});

// Get TalentFinder by ID
const getTalentFinderSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

// === TYPES ===
export type CreateTalentFinderData = z.infer<typeof createTalentFinderSchema>["body"];
export type UpdateTalentFinderData = z.infer<typeof updateTalentFinderSchema>["body"];
export type GetTalentFinderParams = z.infer<typeof getTalentFinderSchema>["params"];

// === GROUPED SCHEMAS ===
export const TalentFinderValidator = {
  createTalentFinderSchema,
  updateTalentFinderSchema,
  getTalentFinderSchema,
};
