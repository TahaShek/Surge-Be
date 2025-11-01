import { create } from "domain";
import { asyncHandler } from "utils/asyncHandler";
import { JobService } from "./job.service";


export const JobController = {
    createJob: asyncHandler(async (req, res) => {
        const response = await JobService.createJob(req.talentFinderId, req.body);

        return res.status(response.status).json(response);
    }),
    // updateJob: asyncHandler(async (req, res) => {
    //     const { jobId } = req.params;
    //     const response = await JobService.updateJob(jobId, req.body);

    //     return res.status(response.status).json(response);
    // }),
    // publishJob: asyncHandler(async (req, res) => {
    //   const { jobId } = req.params;
    //   const { applicationDeadline } = req.body;

    //   const response = await JobService.publishJob(jobId, applicationDeadline);
    //   return res.status(response.status).json(response);
    // }),
}