import { JobModel } from "models/job.model";
import { CreateJobData } from "./job.validator";
import { ApiResponse } from "utils/ApiResponse";
import { IJob } from "../../@types/models/job.types";
import { Types } from "mongoose";

export const JobService = {
  async createJob(talentFinderId: string | Types.ObjectId, data: CreateJobData) {
    const job = await JobModel.create({
      ...data,
      talentFinderId,
      status: "draft",
    });

    return new ApiResponse<IJob>(
      201,
      "Job created successfully",
      job.toObject()
    );
  },

//   async publishJob(jobId: string, ) {
//     const job = await JobModel.findById(jobId);
//     if(job.)
//   };
};
