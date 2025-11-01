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
import mongoose, { Types } from "mongoose";
import { ApiError } from "utils/ApiError";
import { QueueService } from "services/queue.service";
import { getPagination } from "utils/dbHelpers";
import { buildJobQuery, buildJobSortOptions } from "./job.queryBuilder";
import { IUser } from "../../@types/index.types";
import { JobCandidateModel } from "models/jobCandidate.model";
import { TalentSeekerModel } from "models/talentSeeker.model";
import { CloudinaryService } from "../../services/cloudinary.service";
import { IJobCandidate } from "../../@types/models/jobCandidate.types";
import { JobBookmarksModel } from "models/jobBookmarks.model";
import aiService from "../../services/ai.service";

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
  async getAllJobs(
    talentFinderId: string | Types.ObjectId,
    queryParams: GetAllJobsQuery,
    user: IUser
  ) {
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

    filter.talentFinderId = { $ne: talentFinderId };

    // Build sort options
    const sort = buildJobSortOptions("createdAt", "desc");

    // Execute query with pagination
    const [jobs, total] = await Promise.all([
      JobModel.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: "job_bookmarks",
            let: { jobId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$jobId", "$$jobId"] },
                      {
                        $eq: ["$userId", new mongoose.Types.ObjectId(user._id)],
                      },
                    ],
                  },
                },
              },
            ],
            as: "bookmarkData",
          },
        },
        {
          $addFields: {
            bookmarked: { $gt: [{ $size: "$bookmarkData" }, 0] },
          },
        },
        {
          $lookup: {
            from: "talentfinders",
            localField: "talentFinderId",
            foreignField: "_id",
            as: "talentFinder",
          },
        },
        {
          $unwind: {
            path: "$talentFinder",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            bookmarkData: 0,
          },
        },
      ]),
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

  async getAppliedCandidates(
    jobId: string,
    talentFinderId: string | Types.ObjectId
  ) {
    const job = await JobModel.findOne({
      _id: jobId,
      talentFinderId,
    });
    if (!job) {
      throw new ApiError(404, "Job not found");
    }
    const candidates = await JobCandidateModel.find({ jobId }).populate({
      path: "talentSeekerId",
      populate: {
        path: "userId", // nested populate inside TalentSeeker
        model: "User", // explicitly specify model name
      },
    });

    return new ApiResponse<IJobCandidate[]>(
      200,
      "Candidates retrieved successfully",
      candidates.map((c) => c.toObject())
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

  async addJobToBookmarks(jobId: string, userId: string) {
    // Find the talent seeker profile
    const talentSeeker = await TalentSeekerModel.findOne({ userId });
    if (!talentSeeker) {
      throw new ApiError(
        404,
        "Please complete your talent seeker profile before bookmarking jobs"
      );
    }
    const alreadyBookmarked = await JobBookmarksModel.findOne({
      talentSeekrId: talentSeeker._id,
      jobId,
    });
    if (alreadyBookmarked) {
      throw new ApiError(400, "Job already bookmarked");
    }

    // Add job to bookmarks
    await JobBookmarksModel.create({
      jobId,
      talentSeekrId: talentSeeker._id,
      userId,
    });

    return new ApiResponse(201, "Job bookmarked successfully");
  },

  async removeJobFromBookmarks(jobId: string, userId: string) {
    // Find the talent seeker profile
    const talentSeeker = await TalentSeekerModel.findOne({ userId });
    if (!talentSeeker) {
      throw new ApiError(
        404,
        "Please complete your talent seeker profile before removing bookmarked jobs"
      );
    }

    // Remove job from bookmarks
    await JobBookmarksModel.findOneAndDelete({
      talentSeekrId: talentSeeker._id,
      jobId,
      userId,
    });

    return new ApiResponse(200, "Job removed from bookmarks successfully");
  },

  async getBookmarkedJobs(userId: string, queryParams: GetAllJobsQuery) {
    // Find the talent seeker profile
    const talentSeeker = await TalentSeekerModel.findOne({ userId });
    if (!talentSeeker) {
      throw new ApiError(
        404,
        "Please complete your talent seeker profile before retrieving bookmarked jobs"
      );
    }
    const { page, skip, limit } = getPagination({
      page: queryParams.page,
      limit: queryParams.limit,
    });
    const [bookmarks, total] = await Promise.all([
      JobBookmarksModel.find({ talentSeekrId: talentSeeker._id })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "jobId",
        }),
      JobBookmarksModel.countDocuments({ talentSeekrId: talentSeeker._id }),
    ]);

    return new ApiResponse<any>(200, "Bookmarked jobs retrieved successfully", {
      bookmarks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  },

  async updateCandidateStatus(
    candidateId: string,
    status:
      | "applied"
      | "shortlisted"
      | "accepted"
      | "rejected"
      | "withdrawn"
      | "hired"
  ) {
    // Find the candidate
    const candidate = await JobCandidateModel.findById(candidateId);
    if (!candidate) {
      throw new ApiError(404, "Candidate not found");
    }

    // Update the candidate status
    candidate.status = status;
    await candidate.save();

    return new ApiResponse(200, "Candidate status updated successfully");
  },

  /**
   * Calculate match score between talent seeker profile and a job
   */
  async calculateJobMatchScore(jobId: string, userId: string) {
    // Find the job
    const job = await JobModel.findById(jobId).populate(
      "talentFinderId",
      "company location"
    );
    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    // Find the talent seeker profile
    const talentSeeker = await TalentSeekerModel.findOne({ userId });
    if (!talentSeeker) {
      throw new ApiError(
        404,
        "Please complete your talent seeker profile to see match scores"
      );
    }

    // Calculate match score based on multiple criteria
    let totalScore = 0;
    let maxScore = 0;
    const matchDetails: any = {
      skillsMatch: 0,
      experienceMatch: 0,
      locationMatch: 0,
      jobTypeMatch: 0,
      salaryMatch: 0,
      workingTypeMatch: 0,
    };

    // 1. Skills Match (40% weight) - Most important
    maxScore += 40;
    if (
      job.skills &&
      job.skills.length > 0 &&
      talentSeeker.skills &&
      talentSeeker.skills.length > 0
    ) {
      const jobSkillsLower = job.skills.map((s) => s.toLowerCase());
      const seekerSkillsLower = talentSeeker.skills.map((s) => s.toLowerCase());

      const matchingSkills = seekerSkillsLower.filter((skill) =>
        jobSkillsLower.some(
          (jobSkill) => jobSkill.includes(skill) || skill.includes(jobSkill)
        )
      );

      const skillMatchPercentage =
        (matchingSkills.length / jobSkillsLower.length) * 100;
      matchDetails.skillsMatch = Math.round(skillMatchPercentage);
      totalScore += (skillMatchPercentage / 100) * 40;
      matchDetails.matchingSkills = matchingSkills;
      matchDetails.missingSkills = jobSkillsLower.filter(
        (skill) =>
          !seekerSkillsLower.some((s) => s.includes(skill) || skill.includes(s))
      );
    }

    // 2. Experience Level Match (20% weight)
    maxScore += 20;
    if (talentSeeker.experience !== undefined) {
      const experienceYears = talentSeeker.experience;
      let experienceScore = 0;

      switch (job.experienceLevel) {
        case "entry":
          experienceScore =
            experienceYears <= 2 ? 100 : experienceYears <= 4 ? 70 : 50;
          break;
        case "mid":
          experienceScore =
            experienceYears >= 2 && experienceYears <= 5
              ? 100
              : experienceYears > 5
              ? 80
              : 60;
          break;
        case "senior":
          experienceScore =
            experienceYears >= 5 && experienceYears <= 10
              ? 100
              : experienceYears > 10
              ? 90
              : 50;
          break;
        case "lead":
          experienceScore =
            experienceYears >= 8 ? 100 : experienceYears >= 5 ? 70 : 40;
          break;
      }

      matchDetails.experienceMatch = experienceScore;
      totalScore += (experienceScore / 100) * 20;
    }

    // 3. Location Match (15% weight)
    maxScore += 15;
    if (job.location && talentSeeker.location) {
      const jobLocation = job.location.toLowerCase();
      const seekerLocation = talentSeeker.location.toLowerCase();

      if (jobLocation === seekerLocation) {
        matchDetails.locationMatch = 100;
        totalScore += 15;
      } else if (
        jobLocation.includes(seekerLocation) ||
        seekerLocation.includes(jobLocation)
      ) {
        matchDetails.locationMatch = 70;
        totalScore += 10.5;
      } else if (
        talentSeeker.isOpenToRemote &&
        job.jobWorkingType === "remote"
      ) {
        matchDetails.locationMatch = 80;
        totalScore += 12;
      } else {
        matchDetails.locationMatch = 30;
        totalScore += 4.5;
      }
    } else if (job.jobWorkingType === "remote" || talentSeeker.isOpenToRemote) {
      matchDetails.locationMatch = 80;
      totalScore += 12;
    }

    // 4. Job Type Match (10% weight)
    maxScore += 10;
    if (
      talentSeeker.preferredJobTypes &&
      talentSeeker.preferredJobTypes.length > 0
    ) {
      const isPreferredType = talentSeeker.preferredJobTypes.includes(
        job.jobType
      );
      matchDetails.jobTypeMatch = isPreferredType ? 100 : 50;
      totalScore += isPreferredType ? 10 : 5;
    } else {
      // Neutral if no preference specified
      matchDetails.jobTypeMatch = 75;
      totalScore += 7.5;
    }

    // 5. Salary Match (10% weight)
    maxScore += 10;
    if (job.salary && talentSeeker.expectedSalary) {
      const jobSalaryMid = (job.salary.min + job.salary.max) / 2;
      const seekerSalaryMid =
        (talentSeeker.expectedSalary.min + talentSeeker.expectedSalary.max) / 2;

      if (jobSalaryMid >= seekerSalaryMid) {
        matchDetails.salaryMatch = 100;
        totalScore += 10;
      } else if (jobSalaryMid >= talentSeeker.expectedSalary.min) {
        matchDetails.salaryMatch = 75;
        totalScore += 7.5;
      } else {
        const salaryDiff = Math.abs(jobSalaryMid - seekerSalaryMid);
        const salaryMatchPercentage = Math.max(
          0,
          100 - (salaryDiff / seekerSalaryMid) * 100
        );
        matchDetails.salaryMatch = Math.round(salaryMatchPercentage);
        totalScore += (salaryMatchPercentage / 100) * 10;
      }
    }

    // 6. Working Type Match (5% weight)
    maxScore += 5;
    if (job.jobWorkingType === "remote" && talentSeeker.isOpenToRemote) {
      matchDetails.workingTypeMatch = 100;
      totalScore += 5;
    } else if (job.jobWorkingType === "hybrid") {
      matchDetails.workingTypeMatch = 80;
      totalScore += 4;
    } else {
      matchDetails.workingTypeMatch = 60;
      totalScore += 3;
    }

    // Calculate final percentage
    const matchPercentage = Math.round((totalScore / maxScore) * 100);

    // Determine match level
    let matchLevel = "Poor Match";
    if (matchPercentage >= 80) matchLevel = "Excellent Match";
    else if (matchPercentage >= 65) matchLevel = "Good Match";
    else if (matchPercentage >= 50) matchLevel = "Fair Match";

    // Generate AI-powered insights
    const aiInsights = await aiService.generateMatchInsights({
      matchPercentage,
      matchLevel,
      matchDetails,
      jobTitle: job.title,
      talentSeekerSkills: talentSeeker.skills || [],
    });

    return new ApiResponse(200, "Match score calculated successfully", {
      matchPercentage,
      matchLevel,
      matchDetails,
      job: {
        _id: job._id,
        title: job.title,
        company: (job.talentFinderId as any)?.company,
        location: job.location,
        jobType: job.jobType,
        experienceLevel: job.experienceLevel,
        skills: job.skills,
        salary: job.salary,
      },
      aiInsights,
      recommendations: generateRecommendations(matchPercentage, matchDetails),
    });
  },

  /**
   * Get recommended jobs for talent seeker based on their profile
   */
  async getRecommendedJobs(userId: string, queryParams: GetAllJobsQuery) {
    // Find the talent seeker profile
    const talentSeeker = await TalentSeekerModel.findOne({ userId });
    if (!talentSeeker) {
      throw new ApiError(
        404,
        "Please complete your talent seeker profile to see recommendations"
      );
    }

    const { page, skip, limit } = getPagination({
      page: queryParams.page,
      limit: queryParams.limit,
    });

    // Build query based on talent seeker's profile
    const query: any = {
      status: "active",
    };

    // Match skills (if seeker has skills)
    if (talentSeeker.skills && talentSeeker.skills.length > 0) {
      query.skills = {
        $in: talentSeeker.skills.map((s) => new RegExp(s, "i")),
      };
    }

    // Match preferred job types
    if (
      talentSeeker.preferredJobTypes &&
      talentSeeker.preferredJobTypes.length > 0
    ) {
      query.jobType = { $in: talentSeeker.preferredJobTypes };
    }

    // Match location or remote opportunities
    if (talentSeeker.location || talentSeeker.isOpenToRemote) {
      const locationConditions: any[] = [];

      if (talentSeeker.location) {
        locationConditions.push({
          location: new RegExp(talentSeeker.location, "i"),
        });
      }

      if (talentSeeker.isOpenToRemote) {
        locationConditions.push({ jobWorkingType: "remote" });
      }

      if (locationConditions.length > 0) {
        query.$or = locationConditions;
      }
    }

    // Sort by most recently published
    const sort = { publishedAt: -1, createdAt: -1 };

    // Execute query
    const [jobs, total] = await Promise.all([
      JobModel.find(query)
        .populate("talentFinderId", "company location industry")
        .sort(sort as any)
        .skip(skip)
        .limit(limit)
        .lean(),
      JobModel.countDocuments(query),
    ]);

    // Calculate match scores for each job
    const jobsWithScores = jobs.map((job) => {
      let matchScore = 0;

      // Quick skill match calculation
      if (
        job.skills &&
        job.skills.length > 0 &&
        talentSeeker.skills &&
        talentSeeker.skills.length > 0
      ) {
        const jobSkillsLower = job.skills.map((s: string) => s.toLowerCase());
        const seekerSkillsLower = talentSeeker.skills.map((s) =>
          s.toLowerCase()
        );
        const matchingSkills = seekerSkillsLower.filter((skill) =>
          jobSkillsLower.some(
            (jobSkill: string) =>
              jobSkill.includes(skill) || skill.includes(jobSkill)
          )
        );
        matchScore = Math.round(
          (matchingSkills.length / jobSkillsLower.length) * 100
        );
      }

      return {
        ...job,
        matchScore,
      };
    });

    // Sort by match score
    jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);

    // Calculate average match score and top skills
    const avgMatchScore =
      jobsWithScores.length > 0
        ? Math.round(
            jobsWithScores.reduce((sum, job) => sum + job.matchScore, 0) /
              jobsWithScores.length
          )
        : 0;

    // Extract top skills from recommended jobs
    const skillFrequency: Record<string, number> = {};
    jobsWithScores.forEach((job) => {
      job.skills?.forEach((skill: string) => {
        skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
      });
    });
    const topSkills = Object.entries(skillFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([skill]) => skill);

    // Generate AI-powered summary
    const aiSummary = await aiService.generateRecommendationSummary({
      totalJobs: total,
      topSkills,
      avgMatchScore,
      talentSeekerProfile: {
        skills: talentSeeker.skills,
        experience: talentSeeker.experience,
        preferredJobTypes: talentSeeker.preferredJobTypes,
      },
    });

    return new ApiResponse(200, "Recommended jobs retrieved successfully", {
      jobs: jobsWithScores,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      aiSummary,
      insights: {
        avgMatchScore,
        topSkills,
      },
      profileSummary: {
        skills: talentSeeker.skills,
        experience: talentSeeker.experience,
        preferredJobTypes: talentSeeker.preferredJobTypes,
        location: talentSeeker.location,
        isOpenToRemote: talentSeeker.isOpenToRemote,
      },
    });
  },

  async getMyApplications(userId: string | Types.ObjectId) {
    const jobCandidate = await JobCandidateModel.find({ userId }).populate(
      "jobId"
    );
    return new ApiResponse(
      200,
      "Applications retrieved successfully",
      jobCandidate
    );
  },
};

// Helper function to generate recommendations
function generateRecommendations(
  matchPercentage: number,
  matchDetails: any
): string[] {
  const recommendations: string[] = [];

  if (matchPercentage >= 80) {
    recommendations.push(
      "🎉 This is an excellent match! You should definitely apply."
    );
  } else if (matchPercentage >= 65) {
    recommendations.push(
      "✨ This is a good match for your profile. Consider applying!"
    );
  } else if (matchPercentage >= 50) {
    recommendations.push(
      "💡 This could be a good opportunity with some skill development."
    );
  } else {
    recommendations.push(
      "⚠️ This job may not be the best fit, but you can still apply if interested."
    );
  }

  // Skills-based recommendations
  if (matchDetails.skillsMatch < 60 && matchDetails.missingSkills?.length > 0) {
    recommendations.push(
      `📚 Consider learning these skills to improve your match: ${matchDetails.missingSkills
        .slice(0, 3)
        .join(", ")}`
    );
  } else if (matchDetails.skillsMatch >= 80) {
    recommendations.push("✅ Your skills are a great match for this position!");
  }

  // Experience-based recommendations
  if (matchDetails.experienceMatch < 60) {
    recommendations.push(
      "💼 You may be under/over-qualified for this position based on experience."
    );
  }

  // Salary-based recommendations
  if (matchDetails.salaryMatch < 70) {
    recommendations.push(
      "💰 The salary range may not fully meet your expectations."
    );
  }

  // Location-based recommendations
  if (matchDetails.locationMatch < 50 && matchDetails.workingTypeMatch < 60) {
    recommendations.push(
      "📍 Consider if you're willing to relocate or if remote work is negotiable."
    );
  }

  return recommendations;
}
