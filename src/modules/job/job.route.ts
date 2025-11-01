import { Router } from "express";
import { JobController } from "./job.controller";
import { verifyJWT } from "middlewares/auth.middleware";
import { validateResource } from "utils";
import { JobValidator } from "./job.validator";

const router = Router();

/**
 * Public routes - accessible to anyone (job seekers)
 */

// Get all active jobs with filters (public job search)
router.get(
  "/",
  validateResource(JobValidator.getAllJobsSchema),
  JobController.getAllJobs
);

// Get a single job by ID
router.get("/:jobId", JobController.getJobById);

/**
 * Protected routes - require authentication (talent finders/recruiters)
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

// Update an existing job
router.put(
  "/:jobId",
  verifyJWT,
  validateResource(JobValidator.updateJobSchema),
  JobController.updateJob
);

// Publish a draft job (activate it)
router.post("/publish/:jobId", verifyJWT, JobController.publishJob);

// Delete a job
router.delete("/delete/:jobId", verifyJWT, JobController.deleteJob);

export default router;
