import { JobModel } from "models/job.model";
import {
  CreateJobData,
  PublishJobData,
  PublishJobParams,
} from "./job.validator";
import { ApiResponse } from "utils/ApiResponse";
import { IJob } from "../../@types/models/job.types";
import { Types } from "mongoose";
import { ApiError } from "utils/ApiError";
import { QueueService } from "services/queue.service";

export const JobService = {
  async createJob(
    talentFinderId: string | Types.ObjectId,
    data: CreateJobData
  ) {
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

  async publishJob(params: PublishJobParams, data: PublishJobData) {
    const job = await JobModel.findById(params.jobId);
    if (!job) {
      throw new ApiError(404, "Job not found");
    }
    if (job.status === "active") {
      return new ApiResponse<IJob>(
        200,
        "Job is already published",
        job.toObject()
      );
    }

    if (
      data.applicationDeadline &&
      new Date(data.applicationDeadline) > new Date()
    ) {
      job.applicationDeadline = new Date(data.applicationDeadline);
      await QueueService.getQueue("jobQueue")?.add(
        "expireJob",
        { jobId: job._id.toString() },
        {
          delay: new Date(data.applicationDeadline).getTime() - Date.now(),
        }
      );
    }

    job.status = "active";
    await job.save();

    return new ApiResponse<IJob>(
      200,
      "Job published successfully",
      job.toObject()
    );
  },

  async expireJob(jobId: string) {
    const job = await JobModel.findById(jobId);
    if (!job) {
      throw new ApiError(404, "Job not found");
    }
    if (job.status === "closed") {
      return {
        statusCode: 200,
        message: "Job is already expired",
        job: job.toObject(),
      };
    }

    job.status = "closed";
    await job.save();

    return {
      statusCode: 200,
      message: "Job expired successfully",
      job: job.toObject(),
    };
  },

  async deleteJob(jobId: string) {
    const job = await JobModel.findByIdAndDelete(jobId);
    if (!job) {
      throw new ApiError(404, "Job not found");
    }
    return new ApiResponse<IJob>(
      200,
      "Job deleted successfully",
      job.toObject()
    );
  },
};
