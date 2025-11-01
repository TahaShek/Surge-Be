import z from "zod";
declare const createJobSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        requirements: z.ZodOptional<z.ZodString>;
        responsibilities: z.ZodOptional<z.ZodString>;
        skills: z.ZodDefault<z.ZodArray<z.ZodString>>;
        jobType: z.ZodEnum<{
            "full-time": "full-time";
            "part-time": "part-time";
            contract: "contract";
            freelance: "freelance";
            internship: "internship";
        }>;
        experienceLevel: z.ZodEnum<{
            entry: "entry";
            mid: "mid";
            senior: "senior";
            lead: "lead";
        }>;
        location: z.ZodOptional<z.ZodString>;
        jobWorkingType: z.ZodDefault<z.ZodEnum<{
            remote: "remote";
            "on-site": "on-site";
            hybrid: "hybrid";
        }>>;
        salary: z.ZodOptional<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
            currency: z.ZodDefault<z.ZodString>;
        }, z.core.$strip>>;
        benefits: z.ZodOptional<z.ZodArray<z.ZodString>>;
        totalPositions: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const updateJobSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        requirements: z.ZodOptional<z.ZodString>;
        responsibilities: z.ZodOptional<z.ZodString>;
        skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
        jobType: z.ZodOptional<z.ZodEnum<{
            "full-time": "full-time";
            "part-time": "part-time";
            contract: "contract";
            freelance: "freelance";
            internship: "internship";
        }>>;
        experienceLevel: z.ZodOptional<z.ZodEnum<{
            entry: "entry";
            mid: "mid";
            senior: "senior";
            lead: "lead";
        }>>;
        location: z.ZodOptional<z.ZodString>;
        jobWorkingType: z.ZodOptional<z.ZodEnum<{
            remote: "remote";
            "on-site": "on-site";
            hybrid: "hybrid";
        }>>;
        salary: z.ZodOptional<z.ZodObject<{
            min: z.ZodNumber;
            max: z.ZodNumber;
            currency: z.ZodDefault<z.ZodString>;
        }, z.core.$strip>>;
        benefits: z.ZodOptional<z.ZodArray<z.ZodString>>;
        applicationDeadline: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>;
        status: z.ZodOptional<z.ZodEnum<{
            draft: "draft";
            active: "active";
            closed: "closed";
            filled: "filled";
        }>>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const publishJobSchema: z.ZodObject<{
    params: z.ZodObject<{
        jobId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        applicationDeadline: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const getAllJobsSchema: z.ZodObject<{
    query: z.ZodObject<{
        page: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodString>;
        search: z.ZodOptional<z.ZodString>;
        jobType: z.ZodOptional<z.ZodString>;
        experienceLevel: z.ZodOptional<z.ZodString>;
        location: z.ZodOptional<z.ZodString>;
        jobWorkingType: z.ZodOptional<z.ZodString>;
        salaryMin: z.ZodOptional<z.ZodString>;
        salaryMax: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const applyToJobSchema: z.ZodObject<{
    params: z.ZodObject<{
        jobId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        coverLetter: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const updateApplicationStatusSchema: z.ZodObject<{
    params: z.ZodObject<{
        applicationId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        status: z.ZodEnum<{
            applied: "applied";
            shortlisted: "shortlisted";
            accepted: "accepted";
            rejected: "rejected";
            withdrawn: "withdrawn";
            hired: "hired";
        }>;
        notes: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const enhanceJobDescriptionSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        skills: z.ZodDefault<z.ZodArray<z.ZodString>>;
        jobType: z.ZodEnum<{
            "full-time": "full-time";
            "part-time": "part-time";
            contract: "contract";
            freelance: "freelance";
            internship: "internship";
        }>;
        experienceLevel: z.ZodEnum<{
            entry: "entry";
            mid: "mid";
            senior: "senior";
            lead: "lead";
        }>;
        location: z.ZodOptional<z.ZodString>;
        responsibilities: z.ZodOptional<z.ZodString>;
        requirements: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateJobData = z.infer<typeof createJobSchema>["body"];
export type UpdateJobData = z.infer<typeof updateJobSchema>["body"];
export type PublishJobData = z.infer<typeof publishJobSchema>["body"];
export type PublishJobParams = z.infer<typeof publishJobSchema>["params"];
export type GetAllJobsQuery = z.infer<typeof getAllJobsSchema>["query"];
export type ApplyToJobData = z.infer<typeof applyToJobSchema>["body"];
export type ApplyToJobParams = z.infer<typeof applyToJobSchema>["params"];
export type UpdateApplicationStatusData = z.infer<typeof updateApplicationStatusSchema>["body"];
export type UpdateApplicationStatusParams = z.infer<typeof updateApplicationStatusSchema>["params"];
export type EnhanceJobDescriptionData = z.infer<typeof enhanceJobDescriptionSchema>["body"];
export declare const JobValidator: {
    createJobSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodString;
            description: z.ZodString;
            requirements: z.ZodOptional<z.ZodString>;
            responsibilities: z.ZodOptional<z.ZodString>;
            skills: z.ZodDefault<z.ZodArray<z.ZodString>>;
            jobType: z.ZodEnum<{
                "full-time": "full-time";
                "part-time": "part-time";
                contract: "contract";
                freelance: "freelance";
                internship: "internship";
            }>;
            experienceLevel: z.ZodEnum<{
                entry: "entry";
                mid: "mid";
                senior: "senior";
                lead: "lead";
            }>;
            location: z.ZodOptional<z.ZodString>;
            jobWorkingType: z.ZodDefault<z.ZodEnum<{
                remote: "remote";
                "on-site": "on-site";
                hybrid: "hybrid";
            }>>;
            salary: z.ZodOptional<z.ZodObject<{
                min: z.ZodNumber;
                max: z.ZodNumber;
                currency: z.ZodDefault<z.ZodString>;
            }, z.core.$strip>>;
            benefits: z.ZodOptional<z.ZodArray<z.ZodString>>;
            totalPositions: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateJobSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            requirements: z.ZodOptional<z.ZodString>;
            responsibilities: z.ZodOptional<z.ZodString>;
            skills: z.ZodOptional<z.ZodArray<z.ZodString>>;
            jobType: z.ZodOptional<z.ZodEnum<{
                "full-time": "full-time";
                "part-time": "part-time";
                contract: "contract";
                freelance: "freelance";
                internship: "internship";
            }>>;
            experienceLevel: z.ZodOptional<z.ZodEnum<{
                entry: "entry";
                mid: "mid";
                senior: "senior";
                lead: "lead";
            }>>;
            location: z.ZodOptional<z.ZodString>;
            jobWorkingType: z.ZodOptional<z.ZodEnum<{
                remote: "remote";
                "on-site": "on-site";
                hybrid: "hybrid";
            }>>;
            salary: z.ZodOptional<z.ZodObject<{
                min: z.ZodNumber;
                max: z.ZodNumber;
                currency: z.ZodDefault<z.ZodString>;
            }, z.core.$strip>>;
            benefits: z.ZodOptional<z.ZodArray<z.ZodString>>;
            applicationDeadline: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>;
            status: z.ZodOptional<z.ZodEnum<{
                draft: "draft";
                active: "active";
                closed: "closed";
                filled: "filled";
            }>>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    publishJobSchema: z.ZodObject<{
        params: z.ZodObject<{
            jobId: z.ZodString;
        }, z.core.$strip>;
        body: z.ZodObject<{
            applicationDeadline: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodOptional<z.ZodDate>]>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    getAllJobsSchema: z.ZodObject<{
        query: z.ZodObject<{
            page: z.ZodOptional<z.ZodString>;
            limit: z.ZodOptional<z.ZodString>;
            search: z.ZodOptional<z.ZodString>;
            jobType: z.ZodOptional<z.ZodString>;
            experienceLevel: z.ZodOptional<z.ZodString>;
            location: z.ZodOptional<z.ZodString>;
            jobWorkingType: z.ZodOptional<z.ZodString>;
            salaryMin: z.ZodOptional<z.ZodString>;
            salaryMax: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    applyToJobSchema: z.ZodObject<{
        params: z.ZodObject<{
            jobId: z.ZodString;
        }, z.core.$strip>;
        body: z.ZodObject<{
            coverLetter: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    updateApplicationStatusSchema: z.ZodObject<{
        params: z.ZodObject<{
            applicationId: z.ZodString;
        }, z.core.$strip>;
        body: z.ZodObject<{
            status: z.ZodEnum<{
                applied: "applied";
                shortlisted: "shortlisted";
                accepted: "accepted";
                rejected: "rejected";
                withdrawn: "withdrawn";
                hired: "hired";
            }>;
            notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    enhanceJobDescriptionSchema: z.ZodObject<{
        body: z.ZodObject<{
            title: z.ZodString;
            description: z.ZodString;
            skills: z.ZodDefault<z.ZodArray<z.ZodString>>;
            jobType: z.ZodEnum<{
                "full-time": "full-time";
                "part-time": "part-time";
                contract: "contract";
                freelance: "freelance";
                internship: "internship";
            }>;
            experienceLevel: z.ZodEnum<{
                entry: "entry";
                mid: "mid";
                senior: "senior";
                lead: "lead";
            }>;
            location: z.ZodOptional<z.ZodString>;
            responsibilities: z.ZodOptional<z.ZodString>;
            requirements: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    generateInterviewQuestionsSchema: z.ZodObject<{
        params: z.ZodObject<{
            applicationId: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export {};
//# sourceMappingURL=job.validator.d.ts.map