"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalentSeekerValidator = void 0;
const zod_1 = __importDefault(require("zod"));
// Create/Update TalentSeeker Profile
const createTalentSeekerSchema = zod_1.default.object({
    body: zod_1.default.object({
        title: zod_1.default.string().min(1).max(100).optional(),
        bio: zod_1.default.string().max(1000).optional(),
        skills: zod_1.default.array(zod_1.default.string()).default([]),
        experience: zod_1.default.number().min(0).max(50).optional(),
        education: zod_1.default
            .array(zod_1.default.object({
            degree: zod_1.default.string().min(1),
            institution: zod_1.default.string().min(1),
            year: zod_1.default.number().min(1900).max(2100).optional(),
        }))
            .optional(),
        portfolio: zod_1.default.string().url().optional().or(zod_1.default.literal("")),
        github: zod_1.default.string().url().optional().or(zod_1.default.literal("")),
        linkedin: zod_1.default.string().url().optional().or(zod_1.default.literal("")),
        resume: zod_1.default.string().url().optional().or(zod_1.default.literal("")),
        availability: zod_1.default.enum(["available", "not-available", "open-to-offers"]).optional(),
        expectedSalary: zod_1.default
            .object({
            min: zod_1.default.number().min(0),
            max: zod_1.default.number().min(0),
            currency: zod_1.default.string().default("USD"),
        })
            .optional(),
        location: zod_1.default.string().optional(),
        isOpenToRemote: zod_1.default.boolean().optional(),
        preferredJobTypes: zod_1.default
            .array(zod_1.default.enum(["full-time", "part-time", "contract", "freelance"]))
            .optional(),
    }),
});
const updateTalentSeekerSchema = createTalentSeekerSchema;
// Get TalentSeeker by ID
const getTalentSeekerSchema = zod_1.default.object({
    params: zod_1.default.object({
        id: zod_1.default.string().min(1),
    }),
});
// === GROUPED SCHEMAS ===
exports.TalentSeekerValidator = {
    createTalentSeekerSchema,
    updateTalentSeekerSchema,
    getTalentSeekerSchema,
};
//# sourceMappingURL=talentSeeker.validator.js.map