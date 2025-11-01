"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalentFinderValidator = void 0;
const zod_1 = __importDefault(require("zod"));
// Create/Update TalentFinder Profile
const createTalentFinderSchema = zod_1.default.object({
    body: zod_1.default.object({
        company: zod_1.default.string().min(1, "Company name is required").max(200),
        companySize: zod_1.default
            .enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"])
            .optional(),
        industry: zod_1.default.string().min(1).max(100).optional(),
        website: zod_1.default.string().url().optional().or(zod_1.default.literal("")),
        description: zod_1.default.string().max(2000).optional(),
        location: zod_1.default.string().optional(),
    }),
});
const updateTalentFinderSchema = zod_1.default.object({
    body: zod_1.default.object({
        company: zod_1.default.string().min(1).max(200).optional(),
        companySize: zod_1.default
            .enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"])
            .optional(),
        industry: zod_1.default.string().min(1).max(100).optional(),
        website: zod_1.default.string().url().optional().or(zod_1.default.literal("")),
        description: zod_1.default.string().max(2000).optional(),
        location: zod_1.default.string().optional(),
    }),
});
// Get TalentFinder by ID
const getTalentFinderSchema = zod_1.default.object({
    params: zod_1.default.object({
        id: zod_1.default.string().min(1),
    }),
});
// === GROUPED SCHEMAS ===
exports.TalentFinderValidator = {
    createTalentFinderSchema,
    updateTalentFinderSchema,
    getTalentFinderSchema,
};
//# sourceMappingURL=talentFinder.validator.js.map