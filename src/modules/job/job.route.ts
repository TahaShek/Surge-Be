import { Router } from "express";
import { JobController } from "./job.controller";
import { verifyJWT } from "middlewares/auth.middleware";
import { validateResource } from "utils";
import { JobValidator } from "./job.validator";
import { uploadResume } from "middlewares/upload.middleware";

const router = Router();

/**
 * Protected routes - require authentication (talent finders/recruiters)
 * NOTE: These must come BEFORE parameterized routes like /:jobId
 */

router.get("/my-applications", verifyJWT, JobController.getMyApplications);
// Get recommended jobs for talent seeker
router.get(
  "/recommendations",
  verifyJWT,
  validateResource(JobValidator.getAllJobsSchema),
  JobController.getRecommendations
);

// Get all bookmarked jobs
router.get(
  "/bookmarks",
  verifyJWT,
  validateResource(JobValidator.getAllJobsSchema),
  JobController.getBookmarks
);

// Get all jobs posted by the authenticated talent finder
router.get(
  "/my-jobs",
  verifyJWT,
  validateResource(JobValidator.getAllJobsSchema),
  JobController.getMyJobs
);

// Create a new job (draft status)
router.post(
  "/create",
  verifyJWT,
  validateResource(JobValidator.createJobSchema),
  JobController.createJob
);

// Publish a draft job (activate it)
router.post("/publish/:jobId", verifyJWT, JobController.publishJob);

// Delete a job
router.delete("/delete/:jobId", verifyJWT, JobController.deleteJob);

// Get match score for a specific job
router.get("/:jobId/match-score", verifyJWT, JobController.getMatchScore);

// Apply to a job (with optional resume upload)
router.post(
  "/:jobId/apply",
  verifyJWT,
  uploadResume.single("resume"), // Optional resume upload
  validateResource(JobValidator.applyToJobSchema),
  JobController.applyToJob
);

// Add job to bookmarks
router.post("/:jobId/bookmark", verifyJWT, JobController.addBookmark);

// Remove job from bookmarks
router.delete("/:jobId/bookmark", verifyJWT, JobController.removeBookmark);

/**
 * Public routes - accessible to anyone (job seekers)
 */

// Get all active jobs with filters (public job search)
router.get(
  "/",
  verifyJWT,
  validateResource(JobValidator.getAllJobsSchema),
  JobController.getAllJobs
);

// Update an existing job
router.put(
  "/:jobId",
  verifyJWT,
  validateResource(JobValidator.updateJobSchema),
  JobController.updateJob
);

// Get a single job by ID (MUST be last - catches all remaining GET requests)
router.get("/:jobId", verifyJWT, JobController.getJobById);
router.get(
  "/:jobId/applied-candidates",
  verifyJWT,
  JobController.getAppliedCandidates
);
router.put(
  "/:jobId/update-status",
  verifyJWT,
  JobController.updateCandidateStatus
);

export default router;
