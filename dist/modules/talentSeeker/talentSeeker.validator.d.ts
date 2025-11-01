import z from "zod";
declare const createTalentSeekerSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        bio: z.ZodOptional<z.ZodString>;
        skills: z.ZodDefault<z.ZodArray<z.ZodString>>;
        experience: z.ZodOptional<z.ZodNumber>;
        education: z.ZodOptional<z.ZodArray<z.ZodObject<{
            degree: z.ZodString;
            institution: z.ZodString;
            year: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>>;
        portfolio: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        github: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        linkedin: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        resume: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        availability: z.ZodOptional<z.ZodEnum<{
            available: "available";
            "not-available": "not-available";
            "open-to-offers": "open-to-offers";
        }>>;
        expectedSalary: z.ZodOptional<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
            currency: z.ZodDefault<z.ZodString>;
        }, z.core.$strip>>;
        location: z.ZodOptional<z.ZodString>;
        isOpenToRemote: z.ZodOptional<z.ZodBoolean>;
        preferredJobTypes: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            "full-time": "full-time";
            "part-time": "part-time";
            contract: "contract";
            freelance: "freelance";
        }>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const updateTalentSeekerSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        bio: z.ZodOptional<z.ZodString>;
        skills: z.ZodDefault<z.ZodArray<z.ZodString>>;
        experience: z.ZodOptional<z.ZodNumber>;
        education: z.ZodOptional<z.ZodArray<z.ZodObject<{
            degree: z.ZodString;
            institution: z.ZodString;
            year: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>>;
        portfolio: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        github: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        linkedin: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        resume: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        availability: z.ZodOptional<z.ZodEnum<{
            available: "available";
            "not-available": "not-available";
            "open-to-offers": "open-to-offers";
        }>>;
        expectedSalary: z.ZodOptional<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
            currency: z.ZodDefault<z.ZodString>;
        }, z.core.$strip>>;
        location: z.ZodOptional<z.ZodString>;
        isOpenToRemote: z.ZodOptional<z.ZodBoolean>;
        preferredJobTypes: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            "full-time": "full-time";
            "part-time": "part-time";
            contract: "contract";
            freelance: "freelance";
        }>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getTalentSeekerSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateTalentSeekerData = z.infer<typeof createTalentSeekerSchema>["body"];
export type UpdateTalentSeekerData = z.infer<typeof updateTalentSeekerSchema>["body"];
export type GetTalentSeekerParams = z.infer<typeof getTalentSeekerSchema>["params"];
export declare const TalentSeekerValidator: {
    createTalentSeekerSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            bio: z.ZodOptional<z.ZodString>;
            skills: z.ZodDefault<z.ZodArray<z.ZodString>>;
            experience: z.ZodOptional<z.ZodNumber>;
            education: z.ZodOptional<z.ZodArray<z.ZodObject<{
                degree: z.ZodString;
                institution: z.ZodString;
                year: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>>;
            portfolio: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            github: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            linkedin: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            resume: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            availability: z.ZodOptional<z.ZodEnum<{
                available: "available";
                "not-available": "not-available";
                "open-to-offers": "open-to-offers";
            }>>;
            expectedSalary: z.ZodOptional<z.ZodObject<{
                min: z.ZodNumber;
                max: z.ZodNumber;
                currency: z.ZodDefault<z.ZodString>;
            }, z.core.$strip>>;
            location: z.ZodOptional<z.ZodString>;
            isOpenToRemote: z.ZodOptional<z.ZodBoolean>;
            preferredJobTypes: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                "full-time": "full-time";
                "part-time": "part-time";
                contract: "contract";
                freelance: "freelance";
            }>>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateTalentSeekerSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            bio: z.ZodOptional<z.ZodString>;
            skills: z.ZodDefault<z.ZodArray<z.ZodString>>;
            experience: z.ZodOptional<z.ZodNumber>;
            education: z.ZodOptional<z.ZodArray<z.ZodObject<{
                degree: z.ZodString;
                institution: z.ZodString;
                year: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>>;
            portfolio: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            github: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            linkedin: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            resume: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            availability: z.ZodOptional<z.ZodEnum<{
                available: "available";
                "not-available": "not-available";
                "open-to-offers": "open-to-offers";
            }>>;
            expectedSalary: z.ZodOptional<z.ZodObject<{
                min: z.ZodNumber;
                max: z.ZodNumber;
                currency: z.ZodDefault<z.ZodString>;
            }, z.core.$strip>>;
            location: z.ZodOptional<z.ZodString>;
            isOpenToRemote: z.ZodOptional<z.ZodBoolean>;
            preferredJobTypes: z.ZodOptional<z.ZodArray<z.ZodEnum<{
                "full-time": "full-time";
                "part-time": "part-time";
                contract: "contract";
                freelance: "freelance";
            }>>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    getTalentSeekerSchema: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export {};
//# sourceMappingURL=talentSeeker.validator.d.ts.map