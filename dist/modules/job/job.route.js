"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const job_controller_1 = require("./job.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const utils_1 = require("../../utils");
const job_validator_1 = require("./job.validator");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const router = (0, express_1.Router)();
/**
 * Protected routes - require authentication (talent finders/recruiters)
 * NOTE: These must come BEFORE parameterized routes like /:jobId
 */
router.get("/my-applications", auth_middleware_1.verifyJWT, job_controller_1.JobController.getMyApplications);
// Get recommended jobs for talent seeker
router.get("/recommendations", auth_middleware_1.verifyJWT, (0, utils_1.validateResource)(job_validator_1.JobValidator.getAllJobsSchema), job_controller_1.JobController.getRecommendations);
// Get all bookmarked jobs
router.get("/bookmarks", auth_middleware_1.verifyJWT, (0, utils_1.validateResource)(job_validator_1.JobValidator.getAllJobsSchema), job_controller_1.JobController.getBookmarks);
// Get all jobs posted by the authenticated talent finder
router.get("/my-jobs", auth_middleware_1.verifyJWT, (0, utils_1.validateResource)(job_validator_1.JobValidator.getAllJobsSchema), job_controller_1.JobController.getMyJobs);
// Create a new job (draft status)
router.post("/create", auth_middleware_1.verifyJWT, (0, utils_1.validateResource)(job_validator_1.JobValidator.createJobSchema), job_controller_1.JobController.createJob);
// AI FEATURE 1: Enhance job description with AI
router.post("/enhance-description", auth_middleware_1.verifyJWT, (0, utils_1.validateResource)(job_validator_1.JobValidator.enhanceJobDescriptionSchema), job_controller_1.JobController.enhanceJobDescription);
// AI FEATURE 3: Generate interview questions for an application
router.get("/applications/:applicationId/interview-questions", auth_middleware_1.verifyJWT, (0, utils_1.validateResource)(job_validator_1.JobValidator.generateInterviewQuestionsSchema), job_controller_1.JobController.generateInterviewQuestions);
// Update application status (for recruiters)
router.patch("/applications/:applicationId/status", auth_middleware_1.verifyJWT, (0, utils_1.validateResource)(job_validator_1.JobValidator.updateApplicationStatusSchema), job_controller_1.JobController.updateApplicationStatus);
// Publish a draft job (activate it)
router.post("/publish/:jobId", auth_middleware_1.verifyJWT, job_controller_1.JobController.publishJob);
// Delete a job
router.delete("/delete/:jobId", auth_middleware_1.verifyJWT, job_controller_1.JobController.deleteJob);
// Update application status (for recruiters)
router.patch("/applications/:applicationId/status", auth_middleware_1.verifyJWT, (0, utils_1.validateResource)(job_validator_1.JobValidator.updateApplicationStatusSchema), job_controller_1.JobController.updateApplicationStatus);
// Get match score for a specific job
router.get("/:jobId/match-score", auth_middleware_1.verifyJWT, job_controller_1.JobController.getMatchScore);
// Apply to a job (with optional resume upload)
router.post("/:jobId/apply", auth_middleware_1.verifyJWT, upload_middleware_1.uploadResume.single("resume"), // Optional resume upload
(0, utils_1.validateResource)(job_validator_1.JobValidator.applyToJobSchema), job_controller_1.JobController.applyToJob);
// Add job to bookmarks
router.post("/:jobId/bookmark", auth_middleware_1.verifyJWT, job_controller_1.JobController.addBookmark);
// Remove job from bookmarks
router.delete("/:jobId/bookmark", auth_middleware_1.verifyJWT, job_controller_1.JobController.removeBookmark);
/**
 * Public routes - accessible to anyone (job seekers)
 */
// Get all active jobs with filters (public job search)
router.get("/", auth_middleware_1.verifyJWT, (0, utils_1.validateResource)(job_validator_1.JobValidator.getAllJobsSchema), job_controller_1.JobController.getAllJobs);
// Update an existing job
router.put("/:jobId", auth_middleware_1.verifyJWT, (0, utils_1.validateResource)(job_validator_1.JobValidator.updateJobSchema), job_controller_1.JobController.updateJob);
// Get a single job by ID (MUST be last - catches all remaining GET requests)
router.get("/:jobId", auth_middleware_1.verifyJWT, job_controller_1.JobController.getJobById);
router.get("/:jobId/applied-candidates", auth_middleware_1.verifyJWT, job_controller_1.JobController.getAppliedCandidates);
router.put("/:id/update-status", auth_middleware_1.verifyJWT, job_controller_1.JobController.updateCandidateStatus);
exports.default = router;
//# sourceMappingURL=job.route.js.map