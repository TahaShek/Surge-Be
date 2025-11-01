"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const job_service_1 = require("./job.service");
exports.JobController = {
    /**
     * Create a new job (draft status)
     * POST /api/jobs
     */
    createJob: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await job_service_1.JobService.createJob(req.talentFinderId, req.body);
        res.status(response.status).json(response);
    }),
    /**
     * Update an existing job
     * PUT /api/jobs/:jobId
     */
    updateJob: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await job_service_1.JobService.updateJob(req.params.jobId, req.talentFinderId, req.body);
        res.status(response.status).json(response);
    }),
    /**
     * Publish a draft job (activate it)
     * POST /api/jobs/:jobId/publish
     */
    publishJob: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await job_service_1.JobService.publishJob(req.talentFinderId, { jobId: req.params.jobId }, req.body);
        res.status(response.status).json(response);
    }),
    /**
     * Delete a job (soft delete by setting status to closed)
     * DELETE /api/jobs/:jobId
     */
    deleteJob: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await job_service_1.JobService.deleteJob(req.params.jobId, req.talentFinderId);
        res.status(response.status).json(response);
    }),
    /**
     * Get all jobs posted by the authenticated talent finder
     * GET /api/jobs/my-jobs
     */
    getMyJobs: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await job_service_1.JobService.getJobsByTalentFinder(req.talentFinderId, req.query);
        res.status(response.status).json(response);
    }),
    /**
     * Get all public active jobs with filters (for job seekers)
     * GET /api/jobs
     */
    getAllJobs: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await job_service_1.JobService.getAllJobs(req.talentFinderId, req.query, req.user);
        res.status(response.status).json(response);
    }),
    /**
     * Get a single job by ID
     * GET /api/jobs/:jobId
     */
    getJobById: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await job_service_1.JobService.getJobById(req.params.jobId, req.talentFinderId);
        res.status(response.status).json(response);
    }),
    /**
     * Apply to a job
     * POST /api/jobs/:jobId/apply
     */
    applyToJob: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await job_service_1.JobService.applyToJob(req.params.jobId, req.user._id.toString(), req.body, req.file // Resume file from multer
        );
        res.status(response.status).json(response);
    }),
    /**
     * Update application status (for talent finders/recruiters)
     * PATCH /api/jobs/applications/:applicationId/status
     */
    updateApplicationStatus: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await job_service_1.JobService.updateApplicationStatus(req.params.applicationId, req.talentFinderId.toString(), req.body.status, req.body.notes);
        res.status(response.status).json(response);
    }),
    /**
     * Add job to bookmarks
     * POST /api/jobs/:jobId/bookmark
     */
    addBookmark: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await job_service_1.JobService.addJobToBookmarks(req.params.jobId, req.user._id.toString());
        res.status(response.status).json(response);
    }),
    /**
     * Remove job from bookmarks
     * DELETE /api/jobs/:jobId/bookmark
     */
    removeBookmark: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await job_service_1.JobService.removeJobFromBookmarks(req.params.jobId, req.user._id.toString());
        res.status(response.status).json(response);
    }),
    /**
     * Get all bookmarked jobs
     * GET /api/jobs/bookmarks
     */
    getBookmarks: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await job_service_1.JobService.getBookmarkedJobs(req.user._id.toString(), req.query);
        res.status(response.status).json(response);
    }),
    /**
     * Calculate match score for a specific job
     * GET /api/jobs/:jobId/match-score
     */
    getMatchScore: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await job_service_1.JobService.calculateJobMatchScore(req.params.jobId, req.user._id.toString());
        res.status(response.status).json(response);
    }),
    /**
     * Get recommended jobs based on talent seeker profile
     * GET /api/jobs/recommendations
     */
    getRecommendations: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await job_service_1.JobService.getRecommendedJobs(req.user._id.toString(), req.query);
        res.status(response.status).json(response);
    }),
    getAppliedCandidates: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await job_service_1.JobService.getAppliedCandidates(req.params.jobId, req.talentFinderId);
        res.status(response.status).json(response);
    }),
    updateCandidateStatus: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await job_service_1.JobService.updateCandidateStatus(req.params.id, req.body.status);
        res.status(response.status).json(response);
    }),
    getMyApplications: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await job_service_1.JobService.getMyApplications(req.user?._id);
        res.status(response.status).json(response);
    }),
    /**
     * CREATIVE FEATURE 1: Enhance job description with AI
     * POST /api/jobs/enhance-description
     */
    enhanceJobDescription: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await job_service_1.JobService.enhanceJobDescription(req.body);
        res.status(response.status).json(response);
    }),
    /**
     * CREATIVE FEATURE 3: Generate interview questions for an application
     * GET /api/jobs/applications/:applicationId/interview-questions
     */
    generateInterviewQuestions: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const response = await job_service_1.JobService.generateInterviewQuestions(req.params.applicationId, req.talentFinderId.toString());
        res.status(response.status).json(response);
    }),
};
//# sourceMappingURL=job.controller.js.map