import { Router } from "express";
import { validateResource } from "utils/zodValidator";
import { JobValidator } from "./job.validator";
import { JobController } from "./job.controller";
import { verifyJWT } from "middlewares/auth.middleware";

const router = Router();

router.post(
  "/create",
  verifyJWT,
  validateResource(JobValidator.createJobSchema),
  JobController.createJob
);

router.post(
  "/publish/:jobId",
  verifyJWT,
  validateResource(JobValidator.publishJobSchema),
  JobController.publishJob
);

export default router;
