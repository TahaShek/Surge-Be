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

// Apply to a job (with optional resume upload)
router.post(
  "/:jobId/apply",
  verifyJWT,
  uploadResume.single("resume"), // Optional resume upload
  validateResource(JobValidator.applyToJobSchema),
  JobController.applyToJob
);

/**
 * Public routes - accessible to anyone (job seekers)
 */

// Get all active jobs with filters (public job search)
router.get(
  "/",
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
router.get("/:jobId", JobController.getJobById);

export default router;
