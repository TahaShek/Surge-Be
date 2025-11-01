import z from "zod";
declare const createTalentFinderSchema: z.ZodObject<{
    body: z.ZodObject<{
        company: z.ZodString;
        companySize: z.ZodOptional<z.ZodEnum<{
            "1-10": "1-10";
            "11-50": "11-50";
            "51-200": "51-200";
            "201-500": "201-500";
            "501-1000": "501-1000";
            "1000+": "1000+";
        }>>;
        industry: z.ZodOptional<z.ZodString>;
        website: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        description: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const updateTalentFinderSchema: z.ZodObject<{
    body: z.ZodObject<{
        company: z.ZodOptional<z.ZodString>;
        companySize: z.ZodOptional<z.ZodEnum<{
            "1-10": "1-10";
            "11-50": "11-50";
            "51-200": "51-200";
            "201-500": "201-500";
            "501-1000": "501-1000";
            "1000+": "1000+";
        }>>;
        industry: z.ZodOptional<z.ZodString>;
        website: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        description: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getTalentFinderSchema: z.ZodObject<{
    params: z.ZodObject<{
        id: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateTalentFinderData = z.infer<typeof createTalentFinderSchema>["body"];
export type UpdateTalentFinderData = z.infer<typeof updateTalentFinderSchema>["body"];
export type GetTalentFinderParams = z.infer<typeof getTalentFinderSchema>["params"];
export declare const TalentFinderValidator: {
    createTalentFinderSchema: z.ZodObject<{
        body: z.ZodObject<{
            company: z.ZodString;
            companySize: z.ZodOptional<z.ZodEnum<{
                "1-10": "1-10";
                "11-50": "11-50";
                "51-200": "51-200";
                "201-500": "201-500";
                "501-1000": "501-1000";
                "1000+": "1000+";
            }>>;
            industry: z.ZodOptional<z.ZodString>;
            website: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            description: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateTalentFinderSchema: z.ZodObject<{
        body: z.ZodObject<{
            company: z.ZodOptional<z.ZodString>;
            companySize: z.ZodOptional<z.ZodEnum<{
                "1-10": "1-10";
                "11-50": "11-50";
                "51-200": "51-200";
                "201-500": "201-500";
                "501-1000": "501-1000";
                "1000+": "1000+";
            }>>;
            industry: z.ZodOptional<z.ZodString>;
            website: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
            description: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    getTalentFinderSchema: z.ZodObject<{
        params: z.ZodObject<{
            id: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export {};
//# sourceMappingURL=talentFinder.validator.d.ts.map