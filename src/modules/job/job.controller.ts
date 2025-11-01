import { Request, Response } from "express";
import { asyncHandler } from "utils/asyncHandler";
import { JobService } from "./job.service";
import { IUser } from "../../@types/index.types";

export const JobController = {
  /**
   * Create a new job (draft status)
   * POST /api/jobs
   */
  createJob: asyncHandler(async (req, res) => {
    const response = await JobService.createJob(req.talentFinderId, req.body);
    res.status(response.status).json(response);
  }),

  /**
   * Update an existing job
   * PUT /api/jobs/:jobId
   */
  updateJob: asyncHandler(async (req, res) => {
    const response = await JobService.updateJob(
      req.params.jobId,
      req.talentFinderId,
      req.body
    );
    res.status(response.status).json(response);
  }),

  /**
   * Publish a draft job (activate it)
   * POST /api/jobs/:jobId/publish
   */
  publishJob: asyncHandler(async (req, res) => {
    const response = await JobService.publishJob(
      req.talentFinderId,
      { jobId: req.params.jobId },
      req.body
    );
    res.status(response.status).json(response);
  }),

  /**
   * Delete a job (soft delete by setting status to closed)
   * DELETE /api/jobs/:jobId
   */
  deleteJob: asyncHandler(async (req, res) => {
    const response = await JobService.deleteJob(
      req.params.jobId,
      req.talentFinderId
    );
    res.status(response.status).json(response);
  }),

  /**
   * Get all jobs posted by the authenticated talent finder
   * GET /api/jobs/my-jobs
   */
  getMyJobs: asyncHandler(async (req, res) => {
    const response = await JobService.getJobsByTalentFinder(
      req.talentFinderId,
      req.query
    );
    res.status(response.status).json(response);
  }),

  /**
   * Get all public active jobs with filters (for job seekers)
   * GET /api/jobs
   */
  getAllJobs: asyncHandler(async (req: Request, res: Response) => {
    const response = await JobService.getAllJobs(req.talentFinderId, req.query, req.user as IUser);
    res.status(response.status).json(response);
  }),

  /**
   * Get a single job by ID
   * GET /api/jobs/:jobId
   */
  getJobById: asyncHandler(async (req: Request, res: Response) => {
    const response = await JobService.getJobById(
      req.params.jobId,
      req.talentFinderId
    );
    res.status(response.status).json(response);
  }),

  /**
   * Apply to a job
   * POST /api/jobs/:jobId/apply
   */
  applyToJob: asyncHandler(async (req, res) => {
    const response = await JobService.applyToJob(
      req.params.jobId,
      req.user!._id.toString(),
      req.body,
      req.file // Resume file from multer
    );
    res.status(response.status).json(response);
  }),

  /**
   * Add job to bookmarks
   * POST /api/jobs/:jobId/bookmark
   */
  addBookmark: asyncHandler(async (req, res) => {
    const response = await JobService.addJobToBookmarks(
      req.params.jobId,
      req.user!._id.toString()
    );
    res.status(response.status).json(response);
  }),

  /**
   * Remove job from bookmarks
   * DELETE /api/jobs/:jobId/bookmark
   */
  removeBookmark: asyncHandler(async (req, res) => {
    const response = await JobService.removeJobFromBookmarks(
      req.params.jobId,
      req.user!._id.toString()
    );
    res.status(response.status).json(response);
  }),

  /**
   * Get all bookmarked jobs
   * GET /api/jobs/bookmarks
   */
  getBookmarks: asyncHandler(async (req, res) => {
    const response = await JobService.getBookmarkedJobs(
      req.user!._id.toString(),
      req.query
    );
    res.status(response.status).json(response);
  }),

  /**
   * Calculate match score for a specific job
   * GET /api/jobs/:jobId/match-score
   */
  getMatchScore: asyncHandler(async (req, res) => {
    const response = await JobService.calculateJobMatchScore(
      req.params.jobId,
      req.user!._id.toString()
    );
    res.status(response.status).json(response);
  }),

  /**
   * Get recommended jobs based on talent seeker profile
   * GET /api/jobs/recommendations
   */
  getRecommendations: asyncHandler(async (req, res) => {
    const response = await JobService.getRecommendedJobs(
      req.user!._id.toString(),
      req.query
    );
    res.status(response.status).json(response);
  }),

  getAppliedCandidates: asyncHandler(async (req, res) => {
    const response = await JobService.getAppliedCandidates(
      req.params.jobId,
      req.talentFinderId
    );
    res.status(response.status).json(response);
  }),
  updateCandidateStatus: asyncHandler(async (req, res) => {
    const response = await JobService.updateCandidateStatus(
      req.params.id,
      req.body.status
    );
    res.status(response.status).json(response);
  }),
};
