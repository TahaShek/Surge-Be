import { CreateJobData, UpdateJobData, GetAllJobsQuery, PublishJobData, PublishJobParams } from "./job.validator";
import { ApiResponse } from "../../utils/ApiResponse";
import { IJob } from "../../@types/models/job.types";
import mongoose, { Types } from "mongoose";
import { IUser } from "../../@types/index.types";
import { IJobCandidate } from "../../@types/models/jobCandidate.types";
export declare const JobService: {
    createJob(talentFinderId: string | Types.ObjectId, data: CreateJobData): Promise<ApiResponse<IJob>>;
    updateJob(jobId: string, talentFinderId: string | Types.ObjectId, data: UpdateJobData): Promise<ApiResponse<IJob>>;
    publishJob(talentFinderId: string | Types.ObjectId, params: PublishJobParams, data: PublishJobData): Promise<ApiResponse<IJob>>;
    expireJob(jobId: string): Promise<{
        statusCode: number;
        message: string;
        job: IJob & Required<{
            _id: string | Types.ObjectId;
        }> & {
            __v: number;
        };
    }>;
    deleteJob(jobId: string, talentFinderId: string | Types.ObjectId): Promise<ApiResponse<IJob>>;
    getJobsByTalentFinder(talentFinderId: string | Types.ObjectId, queryParams: GetAllJobsQuery): Promise<ApiResponse<{
        jobs: (mongoose.FlattenMaps<{
            talentFinderId: string | Types.ObjectId | {
                userId: string | Types.ObjectId | {
                    firstName: string;
                    lastName: string;
                    email: string;
                    password?: string | undefined;
                    age?: number | undefined;
                    avatar?: string | undefined;
                    googleId?: string | undefined;
                    role: (string | Types.ObjectId | {
                        name: import("../../@types/enum").UserRoleEnum;
                        description?: string | undefined;
                        permissions: (string | Types.ObjectId | {
                            module: string;
                            actions: {
                                create: boolean;
                                read: boolean;
                                update: boolean;
                                delete: boolean;
                            };
                            conditions: {
                                ownedOnly: boolean;
                                orgRestricted: boolean;
                            };
                            _id: Types.ObjectId | string;
                            createdAt?: Date | undefined;
                            updatedAt?: Date | undefined;
                        })[];
                        _id: Types.ObjectId | string;
                        createdAt?: Date | undefined;
                        updatedAt?: Date | undefined;
                    })[];
                    refreshToken?: string | undefined;
                    isVerified?: boolean | undefined;
                    lastLoginAt?: Date | undefined;
                    _id: Types.ObjectId | string;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                };
                company?: string | undefined;
                companySize?: string | undefined;
                industry?: string | undefined;
                website?: string | undefined;
                description?: string | undefined;
                location?: string | undefined;
                isVerifiedCompany?: boolean | undefined;
                _id: Types.ObjectId | string;
                createdAt?: Date | undefined;
                updatedAt?: Date | undefined;
            };
            title: string;
            description: string;
            requirements: string;
            responsibilities?: string | undefined;
            skills: string[];
            jobType: "full-time" | "part-time" | "contract" | "freelance";
            experienceLevel: "entry" | "mid" | "senior" | "lead";
            location?: string | undefined;
            jobWorkingType: "remote" | "on-site" | "hybrid";
            salary?: {
                min: number;
                max: number;
                currency: string;
            } | undefined;
            benefits?: string[] | undefined;
            applicationDeadline?: Date | undefined;
            status: "draft" | "active" | "closed" | "filled";
            applicantsCount?: number | undefined;
            viewsCount?: number | undefined;
            jobCode?: string | undefined;
            totalPositions?: number | undefined;
            publishedAt?: Date | undefined;
            _id: Types.ObjectId | string;
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
        }> & Required<{
            _id: string | Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>>;
    /**
     * Get all public jobs with filters (for job seekers)
     */
    getAllJobs(talentFinderId: string | Types.ObjectId, queryParams: GetAllJobsQuery, user: IUser): Promise<ApiResponse<{
        jobs: any[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>>;
    /**
     * Get single job by ID
     */
    getJobById(jobId: string, talentFidnerId: string | Types.ObjectId): Promise<ApiResponse<IJob>>;
    getAppliedCandidates(jobId: string, talentFinderId: string | Types.ObjectId): Promise<ApiResponse<IJobCandidate[]>>;
    applyToJob(jobId: string, userId: string, applicationData: {
        coverLetter?: string;
    }, resumeFile?: Express.Multer.File): Promise<ApiResponse<any>>;
    updateApplicationStatus(applicationId: string, talentFinderId: string, newStatus: "applied" | "shortlisted" | "accepted" | "rejected" | "withdrawn" | "hired", notes?: string): Promise<ApiResponse<IJobCandidate>>;
    addJobToBookmarks(jobId: string, userId: string): Promise<ApiResponse<unknown>>;
    removeJobFromBookmarks(jobId: string, userId: string): Promise<ApiResponse<unknown>>;
    getBookmarkedJobs(userId: string, queryParams: GetAllJobsQuery): Promise<ApiResponse<any>>;
    updateCandidateStatus(candidateId: string, status: "applied" | "shortlisted" | "accepted" | "rejected" | "withdrawn" | "hired"): Promise<ApiResponse<unknown>>;
    /**
     * Calculate match score between talent seeker profile and a job
     */
    calculateJobMatchScore(jobId: string, userId: string): Promise<ApiResponse<{
        matchPercentage: number;
        matchLevel: string;
        matchDetails: any;
        job: {
            _id: string | Types.ObjectId;
            title: string;
            company: any;
            location: string | undefined;
            jobType: "full-time" | "part-time" | "contract" | "freelance";
            experienceLevel: "entry" | "mid" | "senior" | "lead";
            skills: string[];
            salary: {
                min: number;
                max: number;
                currency: string;
            } | undefined;
        };
        aiInsights: string[];
        recommendations: string[];
    }>>;
    /**
     * Get recommended jobs for talent seeker based on their profile
     */
    getRecommendedJobs(userId: string, queryParams: GetAllJobsQuery): Promise<ApiResponse<{
        jobs: {
            matchScore: number;
            talentFinderId: string | Types.ObjectId | mongoose.FlattenMaps<{
                userId: string | Types.ObjectId | {
                    firstName: string;
                    lastName: string;
                    email: string;
                    password?: string | undefined;
                    age?: number | undefined;
                    avatar?: string | undefined;
                    googleId?: string | undefined;
                    role: (string | Types.ObjectId | {
                        name: import("../../@types/enum").UserRoleEnum;
                        description?: string | undefined;
                        permissions: (string | Types.ObjectId | {
                            module: string;
                            actions: {
                                create: boolean;
                                read: boolean;
                                update: boolean;
                                delete: boolean;
                            };
                            conditions: {
                                ownedOnly: boolean;
                                orgRestricted: boolean;
                            };
                            _id: Types.ObjectId | string;
                            createdAt?: Date | undefined;
                            updatedAt?: Date | undefined;
                        })[];
                        _id: Types.ObjectId | string;
                        createdAt?: Date | undefined;
                        updatedAt?: Date | undefined;
                    })[];
                    refreshToken?: string | undefined;
                    isVerified?: boolean | undefined;
                    lastLoginAt?: Date | undefined;
                    _id: Types.ObjectId | string;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                };
                company?: string | undefined;
                companySize?: string | undefined;
                industry?: string | undefined;
                website?: string | undefined;
                description?: string | undefined;
                location?: string | undefined;
                isVerifiedCompany?: boolean | undefined;
                _id: Types.ObjectId | string;
                createdAt?: Date | undefined;
                updatedAt?: Date | undefined;
            }>;
            title: string;
            description: string;
            requirements: string;
            responsibilities?: string | undefined;
            skills: string[];
            jobType: "full-time" | "part-time" | "contract" | "freelance";
            experienceLevel: "entry" | "mid" | "senior" | "lead";
            location?: string | undefined;
            jobWorkingType: "remote" | "on-site" | "hybrid";
            salary?: mongoose.FlattenMaps<{
                min: number;
                max: number;
                currency: string;
            }> | undefined;
            benefits?: string[] | undefined;
            applicationDeadline?: Date | undefined;
            status: "draft" | "active" | "closed" | "filled";
            applicantsCount?: number | undefined;
            viewsCount?: number | undefined;
            jobCode?: string | undefined;
            totalPositions?: number | undefined;
            publishedAt?: Date | undefined;
            _id: Types.ObjectId | string;
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
            __v: number;
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        aiSummary: string;
        insights: {
            avgMatchScore: number;
            topSkills: string[];
        };
        profileSummary: {
            skills: string[];
            experience: number | undefined;
            preferredJobTypes: ("full-time" | "part-time" | "contract" | "freelance")[] | undefined;
            location: string | undefined;
            isOpenToRemote: boolean | undefined;
        };
    }>>;
    getMyApplications(userId: string | Types.ObjectId): Promise<ApiResponse<(mongoose.Document<unknown, {}, IJobCandidate, {}, {}> & IJobCandidate & Required<{
        _id: string | Types.ObjectId;
    }> & {
        __v: number;
    })[]>>;
    /**
     * CREATIVE FEATURE 1: AI-Powered Job Description Enhancement
     * POST /api/jobs/enhance-description
     */
    enhanceJobDescription(data: {
        title: string;
        description: string;
        skills: string[];
        jobType: string;
        experienceLevel: string;
        location?: string;
        responsibilities?: string;
        requirements?: string;
    }): Promise<ApiResponse<{
        enhancedTitle?: string;
        enhancedDescription?: string;
        suggestedSkills: string[];
        suggestedResponsibilities?: string;
        suggestedRequirements?: string;
        salaryRangeEstimate?: {
            min: number;
            max: number;
            currency: string;
        };
        improvements: string[];
    }>>;
    /**
     * CREATIVE FEATURE 3: AI Interview Questions Generator
     * GET /api/jobs/applications/:applicationId/interview-questions
     */
    generateInterviewQuestions(applicationId: string, talentFinderId: string): Promise<ApiResponse<{
        applicationId: string | Types.ObjectId;
        jobTitle: any;
        candidateName: any;
        questions: {
            technicalQuestions: string[];
            behavioralQuestions: string[];
            situationalQuestions: string[];
            skillGapQuestions: string[];
            cultureQuestions: string[];
        };
    }>>;
};
//# sourceMappingURL=job.service.d.ts.map