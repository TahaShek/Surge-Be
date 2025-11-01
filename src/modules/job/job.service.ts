import { JobModel } from "models/job.model";
import {
  CreateJobData,
  UpdateJobData,
  GetAllJobsQuery,
  PublishJobData,
  PublishJobParams,
} from "./job.validator";
import { ApiResponse } from "utils/ApiResponse";
import { IJob } from "../../@types/models/job.types";
import { Types } from "mongoose";
import { ApiError } from "utils/ApiError";
import { QueueService } from "services/queue.service";
import { getPagination } from "utils/dbHelpers";
import { buildJobQuery, buildJobSortOptions } from "./job.queryBuilder";
import { IUser } from "../../@types/index.types";
import { JobCandidateModel } from "models/jobCandidate.model";
import { TalentSeekerModel } from "models/talentSeeker.model";
import { CloudinaryService } from "../../services/cloudinary.service";
import { IJobCandidate } from "../../@types/models/jobCandidate.types";

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

  async updateJob(
    jobId: string,
    talentFinderId: string | Types.ObjectId,
    data: UpdateJobData
  ) {
    const job = await JobModel.findOne({
      _id: jobId,
      talentFinderId,
    });

    if (!job) {
      throw new ApiError(
        404,
        "Job not found or you don't have permission to update it"
      );
    }

    // Update job fields
    Object.assign(job, data);
    await job.save();

    return new ApiResponse<IJob>(
      200,
      "Job updated successfully",
      job.toObject()
    );
  },

  async publishJob(
    talentFinderId: string | Types.ObjectId,
    params: PublishJobParams,
    data: PublishJobData
  ) {
    const job = await JobModel.findOne({
      _id: params.jobId,
      talentFinderId,
    });
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
    job.publishedAt = new Date();
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

  async deleteJob(jobId: string, talentFinderId: string | Types.ObjectId) {
    const job = await JobModel.findOneAndDelete({
      _id: jobId,
      talentFinderId,
    });
    if (!job) {
      throw new ApiError(404, "Job not found");
    }
    return new ApiResponse<IJob>(
      200,
      "Job deleted successfully",
      job.toObject()
    );
  },

  async getJobsByTalentFinder(
    talentFinderId: string | Types.ObjectId,
    queryParams: GetAllJobsQuery
  ) {
    const { page, skip, limit } = getPagination({
      page: queryParams.page,
      limit: queryParams.limit,
    });

    // Build query using helper function
    const filter = buildJobQuery(queryParams, {
      talentFinderId: talentFinderId.toString(),
      defaultStatus: ["draft", "active", "closed", "filled"], // Show all statuses for talent finder
      includeExpired: true, // Show expired jobs to talent finder
    });

    // Build sort options
    const sort = buildJobSortOptions("createdAt", "desc");

    // Execute query with pagination
    const [jobs, total] = await Promise.all([
      JobModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      JobModel.countDocuments(filter),
    ]);

    return new ApiResponse(200, "Jobs retrieved successfully", {
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  },

  /**
   * Get all public jobs with filters (for job seekers)
   */
  async getAllJobs(queryParams: GetAllJobsQuery) {
    const { page, skip, limit } = getPagination({
      page: queryParams.page,
      limit: queryParams.limit,
    });

    // Build query - only active jobs for public
    const filter = buildJobQuery(queryParams, {
      defaultStatus: "active",
      includeExpired: false,
      onlyActive: true,
    });

    // Build sort options
    const sort = buildJobSortOptions("createdAt", "desc");

    // Execute query with pagination
    const [jobs, total] = await Promise.all([
      JobModel.find(filter)
        .populate("talentFinderId", "company location industry")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      JobModel.countDocuments(filter),
    ]);

    return new ApiResponse(200, "Jobs retrieved successfully", {
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  },

  /**
   * Get single job by ID
   */
  async getJobById(jobId: string, talentFidnerId: string | Types.ObjectId) {
    const job = await JobModel.findById(jobId)
      .populate({
        path: "talentFinderId",
        select: "company location industry website description userId",
        populate: {
          path: "userId",
          select: "firstName lastName avatar", // fields from User model
        },
      })
      .lean();

    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    if (job.talentFinderId.toString() !== talentFidnerId.toString()) {
      await JobModel.findByIdAndUpdate(jobId, { $inc: { viewsCount: 1 } });
    }
    return new ApiResponse<IJob>(
      200,
      "Job retrieved successfully",
      job as IJob
    );
  },

  async applyToJob(
    jobId: string,
    userId: string,
    applicationData: {
      coverLetter?: string;
    },
    resumeFile?: Express.Multer.File
  ) {
    // Find the job
    const job = await JobModel.findById(jobId);
    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    // Check if job is active
    if (job.status !== "active") {
      throw new ApiError(400, "This job is not accepting applications");
    }

    // Find the talent seeker profile
    const talentSeeker = await TalentSeekerModel.findOne({ userId });
    if (!talentSeeker) {
      throw new ApiError(
        404,
        "Please complete your talent seeker profile before applying to jobs"
      );
    }

    // Check if already applied
    const alreadyApplied = await JobCandidateModel.findOne({
      jobId,
      talentSeekerId: talentSeeker._id,
    });

    if (alreadyApplied) {
      throw new ApiError(400, "You have already applied to this job");
    }

    // Upload resume to Cloudinary if provided
    let resumeUrl: string | undefined;
    if (resumeFile) {
      resumeUrl = await CloudinaryService.uploadResume(
        resumeFile.buffer,
        `${userId}_${jobId}`,
        resumeFile.originalname
      );
    } else {
      // Use resume from talent seeker profile
      resumeUrl = talentSeeker.resume;
    }

    // Create application
    const application = await JobCandidateModel.create({
      jobId,
      talentSeekerId: talentSeeker._id,
      coverLetter: applicationData.coverLetter,
      resumeUrl,
      status: "applied",
      appliedAt: new Date(),
    });

    // Increment applicants count
    await JobModel.findByIdAndUpdate(jobId, {
      $inc: { applicantsCount: 1 },
    });

    // Populate the application data for response
    const populatedApplication = await JobCandidateModel.findById(
      application._id
    )
      .populate("jobId", "title company location jobType")
      .populate("talentSeekerId", "userId title skills");

    return new ApiResponse<IJobCandidate>(
      201,
      "Application submitted successfully",
      populatedApplication!.toObject()
    );
  },
};
