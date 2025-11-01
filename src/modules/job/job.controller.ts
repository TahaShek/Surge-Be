import { asyncHandler } from "utils/asyncHandler";
import { JobService } from "./job.service";
import { PublishJobParams } from "./job.validator";

export const JobController = {
  createJob: asyncHandler(async (req, res) => {
    const response = await JobService.createJob(req.talentFinderId, req.body);

    return res.status(response.status).json(response);
  }),
  publishJob: asyncHandler(async (req, res) => {
    const response = await JobService.publishJob(
      req.params as PublishJobParams,
      req.body
    );
    return res.status(response.status).json(response);
  }),
  deleteJob: asyncHandler(async (req, res) => {
    const response = await JobService.deleteJob(req.params.jobId);
    return res.status(response.status).json(response);
  }),
};
