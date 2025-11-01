import { Request, Response } from "express";
export declare const JobController: {
    /**
     * Create a new job (draft status)
     * POST /api/jobs
     */
    createJob: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Update an existing job
     * PUT /api/jobs/:jobId
     */
    updateJob: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Publish a draft job (activate it)
     * POST /api/jobs/:jobId/publish
     */
    publishJob: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Delete a job (soft delete by setting status to closed)
     * DELETE /api/jobs/:jobId
     */
    deleteJob: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Get all jobs posted by the authenticated talent finder
     * GET /api/jobs/my-jobs
     */
    getMyJobs: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Get all public active jobs with filters (for job seekers)
     * GET /api/jobs
     */
    getAllJobs: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Get a single job by ID
     * GET /api/jobs/:jobId
     */
    getJobById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Apply to a job
     * POST /api/jobs/:jobId/apply
     */
    applyToJob: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Update application status (for talent finders/recruiters)
     * PATCH /api/jobs/applications/:applicationId/status
     */
    updateApplicationStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Add job to bookmarks
     * POST /api/jobs/:jobId/bookmark
     */
    addBookmark: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Remove job from bookmarks
     * DELETE /api/jobs/:jobId/bookmark
     */
    removeBookmark: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Get all bookmarked jobs
     * GET /api/jobs/bookmarks
     */
    getBookmarks: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Calculate match score for a specific job
     * GET /api/jobs/:jobId/match-score
     */
    getMatchScore: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * Get recommended jobs based on talent seeker profile
     * GET /api/jobs/recommendations
     */
    getRecommendations: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getAppliedCandidates: (req: Request, res: Response, next: import("express").NextFunction) => void;
    updateCandidateStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getMyApplications: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * CREATIVE FEATURE 1: Enhance job description with AI
     * POST /api/jobs/enhance-description
     */
    enhanceJobDescription: (req: Request, res: Response, next: import("express").NextFunction) => void;
    /**
     * CREATIVE FEATURE 3: Generate interview questions for an application
     * GET /api/jobs/applications/:applicationId/interview-questions
     */
    generateInterviewQuestions: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=job.controller.d.ts.map