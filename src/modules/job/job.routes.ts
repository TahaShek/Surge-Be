import { Router } from "express";
import { validateResource } from "utils/zodValidator";
import { JobValidator } from "./job.validator";
import { JobController } from "./job.controller";

const router = Router();

router.post(
  "/create",
  validateResource(JobValidator.createJobSchema),
  JobController.createJob
);

export default router;
