"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobService = void 0;
const job_model_1 = require("../../models/job.model");
const ApiResponse_1 = require("../../utils/ApiResponse");
const mongoose_1 = __importDefault(require("mongoose"));
const ApiError_1 = require("../../utils/ApiError");
const queue_service_1 = require("../../services/queue.service");
const dbHelpers_1 = require("../../utils/dbHelpers");
const job_queryBuilder_1 = require("./job.queryBuilder");
const jobCandidate_model_1 = require("../../models/jobCandidate.model");
const talentSeeker_model_1 = require("../../models/talentSeeker.model");
const cloudinary_service_1 = require("../../services/cloudinary.service");
const jobBookmarks_model_1 = require("../../models/jobBookmarks.model");
const ai_service_1 = __importDefault(require("../../services/ai.service"));
const NotificationService_1 = require("../../socket/services/NotificationService");
const talentFinder_model_1 = require("../../models/talentFinder.model");
const logger_1 = __importDefault(require("../../config/logger"));
exports.JobService = {
    async createJob(talentFinderId, data) {
        const job = await job_model_1.JobModel.create({
            ...data,
            talentFinderId,
            status: "draft",
        });
        return new ApiResponse_1.ApiResponse(201, "Job created successfully", job.toObject());
    },
    async updateJob(jobId, talentFinderId, data) {
        const job = await job_model_1.JobModel.findOne({
            _id: jobId,
            talentFinderId,
        });
        if (!job) {
            throw new ApiError_1.ApiError(404, "Job not found or you don't have permission to update it");
        }
        // Update job fields
        Object.assign(job, data);
        await job.save();
        return new ApiResponse_1.ApiResponse(200, "Job updated successfully", job.toObject());
    },
    async publishJob(talentFinderId, params, data) {
        const job = await job_model_1.JobModel.findOne({
            _id: params.jobId,
            talentFinderId,
        });
        if (!job) {
            throw new ApiError_1.ApiError(404, "Job not found");
        }
        if (job.status === "active") {
            return new ApiResponse_1.ApiResponse(200, "Job is already published", job.toObject());
        }
        if (data.applicationDeadline &&
            new Date(data.applicationDeadline) > new Date()) {
            job.applicationDeadline = new Date(data.applicationDeadline);
            await queue_service_1.QueueService.getQueue("jobQueue")?.add("expireJob", { jobId: job._id.toString() }, {
                delay: new Date(data.applicationDeadline).getTime() - Date.now(),
            });
        }
        job.status = "active";
        job.publishedAt = new Date();
        await job.save();
        return new ApiResponse_1.ApiResponse(200, "Job published successfully", job.toObject());
    },
    async expireJob(jobId) {
        const job = await job_model_1.JobModel.findById(jobId);
        if (!job) {
            throw new ApiError_1.ApiError(404, "Job not found");
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
    async deleteJob(jobId, talentFinderId) {
        const job = await job_model_1.JobModel.findOneAndDelete({
            _id: jobId,
            talentFinderId,
        });
        if (!job) {
            throw new ApiError_1.ApiError(404, "Job not found");
        }
        return new ApiResponse_1.ApiResponse(200, "Job deleted successfully", job.toObject());
    },
    async getJobsByTalentFinder(talentFinderId, queryParams) {
        const { page, skip, limit } = (0, dbHelpers_1.getPagination)({
            page: queryParams.page,
            limit: queryParams.limit,
        });
        // Build query using helper function
        const filter = (0, job_queryBuilder_1.buildJobQuery)(queryParams, {
            talentFinderId: talentFinderId.toString(),
            defaultStatus: ["draft", "active", "closed", "filled"], // Show all statuses for talent finder
            includeExpired: true, // Show expired jobs to talent finder
        });
        // Build sort options
        const sort = (0, job_queryBuilder_1.buildJobSortOptions)("createdAt", "desc");
        // Execute query with pagination
        const [jobs, total] = await Promise.all([
            job_model_1.JobModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
            job_model_1.JobModel.countDocuments(filter),
        ]);
        return new ApiResponse_1.ApiResponse(200, "Jobs retrieved successfully", {
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
    async getAllJobs(talentFinderId, queryParams, user) {
        const { page, skip, limit } = (0, dbHelpers_1.getPagination)({
            page: queryParams.page,
            limit: queryParams.limit,
        });
        // Build query - only active jobs for public
        const filter = (0, job_queryBuilder_1.buildJobQuery)(queryParams, {
            defaultStatus: "active",
            includeExpired: false,
            onlyActive: true,
        });
        filter.talentFinderId = { $ne: talentFinderId };
        // Build sort options
        const sort = (0, job_queryBuilder_1.buildJobSortOptions)("createdAt", "desc");
        // Execute query with pagination
        const [jobs, total] = await Promise.all([
            job_model_1.JobModel.aggregate([
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
                                                $eq: ["$userId", new mongoose_1.default.Types.ObjectId(user._id)],
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
            job_model_1.JobModel.countDocuments(filter),
        ]);
        return new ApiResponse_1.ApiResponse(200, "Jobs retrieved successfully", {
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
    async getJobById(jobId, talentFidnerId) {
        const job = await job_model_1.JobModel.findById(jobId)
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
            throw new ApiError_1.ApiError(404, "Job not found");
        }
        if (job.talentFinderId.toString() !== talentFidnerId.toString()) {
            await job_model_1.JobModel.findByIdAndUpdate(jobId, { $inc: { viewsCount: 1 } });
        }
        return new ApiResponse_1.ApiResponse(200, "Job retrieved successfully", job);
    },
    async getAppliedCandidates(jobId, talentFinderId) {
        const job = await job_model_1.JobModel.findOne({
            _id: jobId,
            talentFinderId,
        });
        if (!job) {
            throw new ApiError_1.ApiError(404, "Job not found");
        }
        const candidates = await jobCandidate_model_1.JobCandidateModel.find({ jobId }).populate({
            path: "talentSeekerId",
            populate: {
                path: "userId", // nested populate inside TalentSeeker
                model: "User", // explicitly specify model name
            },
        });
        return new ApiResponse_1.ApiResponse(200, "Candidates retrieved successfully", candidates.map((c) => c.toObject()));
    },
    async applyToJob(jobId, userId, applicationData, resumeFile) {
        // Find the job
        const job = await job_model_1.JobModel.findById(jobId);
        if (!job) {
            throw new ApiError_1.ApiError(404, "Job not found");
        }
        // Check if job is active
        if (job.status !== "active") {
            throw new ApiError_1.ApiError(400, "This job is not accepting applications");
        }
        // Find the talent seeker profile
        const talentSeeker = await talentSeeker_model_1.TalentSeekerModel.findOne({ userId });
        if (!talentSeeker) {
            throw new ApiError_1.ApiError(404, "Please complete your talent seeker profile before applying to jobs");
        }
        // Check if already applied
        const alreadyApplied = await jobCandidate_model_1.JobCandidateModel.findOne({
            jobId,
            talentSeekerId: talentSeeker._id,
        });
        if (alreadyApplied) {
            throw new ApiError_1.ApiError(400, "You have already applied to this job");
        }
        // Upload resume to Cloudinary if provided
        let resumeUrl;
        if (resumeFile) {
            resumeUrl = await cloudinary_service_1.CloudinaryService.uploadResume(resumeFile.buffer, `${userId}_${jobId}`, resumeFile.originalname);
        }
        else {
            // Use resume from talent seeker profile
            resumeUrl = talentSeeker.resume;
        }
        // Create application
        const application = await jobCandidate_model_1.JobCandidateModel.create({
            jobId,
            talentSeekerId: talentSeeker._id,
            coverLetter: applicationData.coverLetter,
            resumeUrl,
            status: "applied",
            appliedAt: new Date(),
        });
        // Increment applicants count
        await job_model_1.JobModel.findByIdAndUpdate(jobId, {
            $inc: { applicantsCount: 1 },
        });
        // CREATIVE FEATURE 2: Analyze cover letter if provided
        let coverLetterAnalysis = null;
        if (applicationData.coverLetter) {
            try {
                coverLetterAnalysis = await ai_service_1.default.analyzeCoverLetter({
                    coverLetter: applicationData.coverLetter,
                    jobTitle: job.title,
                    jobDescription: job.description,
                    candidateSkills: talentSeeker.skills || [],
                });
                logger_1.default.info(`Cover letter analyzed for application ${application._id}: Score ${coverLetterAnalysis.score}`);
            }
            catch (error) {
                logger_1.default.error("Failed to analyze cover letter:", error);
            }
        }
        // Populate the application data for response
        const populatedApplication = await jobCandidate_model_1.JobCandidateModel.findById(application._id)
            .populate("jobId", "title company location jobType")
            .populate("talentSeekerId", "userId title skills");
        // Send notification to talent finder (job poster)
        try {
            const talentFinder = await talentFinder_model_1.TalentFinderModel.findById(job.talentFinderId).populate("userId", "_id");
            if (talentFinder && talentFinder.userId) {
                const notificationService = new NotificationService_1.NotificationService();
                const recruiterUserId = talentFinder.userId._id.toString();
                await notificationService.sendInfo(recruiterUserId, "New Job Application", `${talentSeeker.title || "A candidate"} has applied to your job: ${job.title}`, {
                    jobId: job._id,
                    jobTitle: job.title,
                    applicantId: talentSeeker._id,
                    applicantName: talentSeeker.title,
                    applicantSkills: talentSeeker.skills,
                    applicationId: application._id,
                    coverLetterScore: coverLetterAnalysis?.score,
                    type: "job_application",
                });
            }
        }
        catch (error) {
            // Log error but don't fail the application
            logger_1.default.error("Failed to send job application notification:", error);
        }
        return new ApiResponse_1.ApiResponse(201, "Application submitted successfully", {
            ...populatedApplication.toObject(),
            coverLetterAnalysis, // Include analysis in response
        });
    },
    async updateApplicationStatus(applicationId, talentFinderId, newStatus, notes) {
        // Find the application and populate necessary fields
        const application = await jobCandidate_model_1.JobCandidateModel.findById(applicationId)
            .populate("jobId")
            .populate({
            path: "talentSeekerId",
            populate: { path: "userId", select: "_id email" },
        });
        if (!application) {
            throw new ApiError_1.ApiError(404, "Application not found");
        }
        // Verify that the job belongs to this talent finder
        const job = application.jobId;
        if (job.talentFinderId.toString() !== talentFinderId) {
            throw new ApiError_1.ApiError(403, "You are not authorized to update this application");
        }
        // Store old status for notification
        const oldStatus = application.status;
        // Update application status
        application.status = newStatus;
        if (notes) {
            application.notes = notes;
        }
        // Update timestamps based on status
        if (newStatus === "accepted" && !application.acceptedAt) {
            application.acceptedAt = new Date();
        }
        else if (newStatus === "rejected" && !application.rejectedAt) {
            application.rejectedAt = new Date();
        }
        await application.save();
        // Send notification to talent seeker (candidate)
        try {
            const talentSeeker = application.talentSeekerId;
            if (talentSeeker && talentSeeker.userId && talentSeeker.userId._id) {
                const notificationService = new NotificationService_1.NotificationService();
                const candidateUserId = talentSeeker.userId._id.toString();
                // Determine notification type and message based on status
                let title = "Application Status Updated";
                let message = `Your application for "${job.title}" has been updated to: ${newStatus}`;
                let notificationType = "info";
                switch (newStatus) {
                    case "shortlisted":
                        title = "You've Been Shortlisted! 🎉";
                        message = `Great news! You've been shortlisted for "${job.title}"`;
                        notificationType = "success";
                        break;
                    case "accepted":
                        title = "Application Accepted! 🎊";
                        message = `Congratulations! Your application for "${job.title}" has been accepted`;
                        notificationType = "success";
                        break;
                    case "hired":
                        title = "You're Hired! 🎉🎉";
                        message = `Amazing! You've been hired for "${job.title}"`;
                        notificationType = "success";
                        break;
                    case "rejected":
                        title = "Application Status Update";
                        message = `Thank you for your interest in "${job.title}". Unfortunately, we won't be moving forward at this time.`;
                        notificationType = "info";
                        break;
                    case "withdrawn":
                        title = "Application Withdrawn";
                        message = `Your application for "${job.title}" has been withdrawn`;
                        notificationType = "warning";
                        break;
                }
                // Send notification based on type
                if (notificationType === "success") {
                    await notificationService.sendSuccess(candidateUserId, title, message, {
                        jobId: job._id,
                        jobTitle: job.title,
                        applicationId: application._id,
                        status: newStatus,
                        oldStatus: oldStatus,
                        notes: notes,
                        type: "application_status_update",
                    });
                }
                else if (notificationType === "warning") {
                    await notificationService.sendWarning(candidateUserId, title, message, {
                        jobId: job._id,
                        jobTitle: job.title,
                        applicationId: application._id,
                        status: newStatus,
                        oldStatus: oldStatus,
                        notes: notes,
                        type: "application_status_update",
                    });
                }
                else {
                    await notificationService.sendInfo(candidateUserId, title, message, {
                        jobId: job._id,
                        jobTitle: job.title,
                        applicationId: application._id,
                        status: newStatus,
                        oldStatus: oldStatus,
                        notes: notes,
                        type: "application_status_update",
                    });
                }
            }
        }
        catch (error) {
            // Log error but don't fail the status update
            logger_1.default.error("Failed to send application status notification:", error);
        }
        // Populate for response
        const updatedApplication = await jobCandidate_model_1.JobCandidateModel.findById(applicationId)
            .populate("jobId", "title company location jobType")
            .populate("talentSeekerId", "userId title skills");
        return new ApiResponse_1.ApiResponse(200, "Application status updated successfully", updatedApplication.toObject());
    },
    async addJobToBookmarks(jobId, userId) {
        // Find the talent seeker profile
        const talentSeeker = await talentSeeker_model_1.TalentSeekerModel.findOne({ userId });
        if (!talentSeeker) {
            throw new ApiError_1.ApiError(404, "Please complete your talent seeker profile before bookmarking jobs");
        }
        const alreadyBookmarked = await jobBookmarks_model_1.JobBookmarksModel.findOne({
            talentSeekrId: talentSeeker._id,
            jobId,
        });
        if (alreadyBookmarked) {
            throw new ApiError_1.ApiError(400, "Job already bookmarked");
        }
        // Add job to bookmarks
        await jobBookmarks_model_1.JobBookmarksModel.create({
            jobId,
            talentSeekrId: talentSeeker._id,
            userId,
        });
        return new ApiResponse_1.ApiResponse(201, "Job bookmarked successfully");
    },
    async removeJobFromBookmarks(jobId, userId) {
        // Find the talent seeker profile
        const talentSeeker = await talentSeeker_model_1.TalentSeekerModel.findOne({ userId });
        if (!talentSeeker) {
            throw new ApiError_1.ApiError(404, "Please complete your talent seeker profile before removing bookmarked jobs");
        }
        // Remove job from bookmarks
        await jobBookmarks_model_1.JobBookmarksModel.findOneAndDelete({
            talentSeekrId: talentSeeker._id,
            jobId,
            userId,
        });
        return new ApiResponse_1.ApiResponse(200, "Job removed from bookmarks successfully");
    },
    async getBookmarkedJobs(userId, queryParams) {
        // Find the talent seeker profile
        const talentSeeker = await talentSeeker_model_1.TalentSeekerModel.findOne({ userId });
        if (!talentSeeker) {
            throw new ApiError_1.ApiError(404, "Please complete your talent seeker profile before retrieving bookmarked jobs");
        }
        const { page, skip, limit } = (0, dbHelpers_1.getPagination)({
            page: queryParams.page,
            limit: queryParams.limit,
        });
        const [bookmarks, total] = await Promise.all([
            jobBookmarks_model_1.JobBookmarksModel.find({ talentSeekrId: talentSeeker._id })
                .skip(skip)
                .limit(limit)
                .populate({
                path: "jobId",
            }),
            jobBookmarks_model_1.JobBookmarksModel.countDocuments({ talentSeekrId: talentSeeker._id }),
        ]);
        return new ApiResponse_1.ApiResponse(200, "Bookmarked jobs retrieved successfully", {
            bookmarks,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    },
    async updateCandidateStatus(candidateId, status) {
        // Find the candidate
        const candidate = await jobCandidate_model_1.JobCandidateModel.findById(candidateId);
        if (!candidate) {
            throw new ApiError_1.ApiError(404, "Candidate not found");
        }
        // Update the candidate status
        candidate.status = status;
        await candidate.save();
        return new ApiResponse_1.ApiResponse(200, "Candidate status updated successfully");
    },
    /**
     * Calculate match score between talent seeker profile and a job
     */
    async calculateJobMatchScore(jobId, userId) {
        // Find the job
        const job = await job_model_1.JobModel.findById(jobId).populate("talentFinderId", "company location");
        if (!job) {
            throw new ApiError_1.ApiError(404, "Job not found");
        }
        // Find the talent seeker profile
        const talentSeeker = await talentSeeker_model_1.TalentSeekerModel.findOne({ userId });
        if (!talentSeeker) {
            throw new ApiError_1.ApiError(404, "Please complete your talent seeker profile to see match scores");
        }
        // Calculate match score based on multiple criteria
        let totalScore = 0;
        let maxScore = 0;
        const matchDetails = {
            skillsMatch: 0,
            experienceMatch: 0,
            locationMatch: 0,
            jobTypeMatch: 0,
            salaryMatch: 0,
            workingTypeMatch: 0,
        };
        // 1. Skills Match (40% weight) - Most important
        maxScore += 40;
        if (job.skills &&
            job.skills.length > 0 &&
            talentSeeker.skills &&
            talentSeeker.skills.length > 0) {
            const jobSkillsLower = job.skills.map((s) => s.toLowerCase());
            const seekerSkillsLower = talentSeeker.skills.map((s) => s.toLowerCase());
            const matchingSkills = seekerSkillsLower.filter((skill) => jobSkillsLower.some((jobSkill) => jobSkill.includes(skill) || skill.includes(jobSkill)));
            const skillMatchPercentage = (matchingSkills.length / jobSkillsLower.length) * 100;
            matchDetails.skillsMatch = Math.round(skillMatchPercentage);
            totalScore += (skillMatchPercentage / 100) * 40;
            matchDetails.matchingSkills = matchingSkills;
            matchDetails.missingSkills = jobSkillsLower.filter((skill) => !seekerSkillsLower.some((s) => s.includes(skill) || skill.includes(s)));
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
            }
            else if (jobLocation.includes(seekerLocation) ||
                seekerLocation.includes(jobLocation)) {
                matchDetails.locationMatch = 70;
                totalScore += 10.5;
            }
            else if (talentSeeker.isOpenToRemote &&
                job.jobWorkingType === "remote") {
                matchDetails.locationMatch = 80;
                totalScore += 12;
            }
            else {
                matchDetails.locationMatch = 30;
                totalScore += 4.5;
            }
        }
        else if (job.jobWorkingType === "remote" || talentSeeker.isOpenToRemote) {
            matchDetails.locationMatch = 80;
            totalScore += 12;
        }
        // 4. Job Type Match (10% weight)
        maxScore += 10;
        if (talentSeeker.preferredJobTypes &&
            talentSeeker.preferredJobTypes.length > 0) {
            const isPreferredType = talentSeeker.preferredJobTypes.includes(job.jobType);
            matchDetails.jobTypeMatch = isPreferredType ? 100 : 50;
            totalScore += isPreferredType ? 10 : 5;
        }
        else {
            // Neutral if no preference specified
            matchDetails.jobTypeMatch = 75;
            totalScore += 7.5;
        }
        // 5. Salary Match (10% weight)
        maxScore += 10;
        if (job.salary && talentSeeker.expectedSalary) {
            const jobSalaryMid = (job.salary.min + job.salary.max) / 2;
            const seekerSalaryMid = (talentSeeker.expectedSalary.min + talentSeeker.expectedSalary.max) / 2;
            if (jobSalaryMid >= seekerSalaryMid) {
                matchDetails.salaryMatch = 100;
                totalScore += 10;
            }
            else if (jobSalaryMid >= talentSeeker.expectedSalary.min) {
                matchDetails.salaryMatch = 75;
                totalScore += 7.5;
            }
            else {
                const salaryDiff = Math.abs(jobSalaryMid - seekerSalaryMid);
                const salaryMatchPercentage = Math.max(0, 100 - (salaryDiff / seekerSalaryMid) * 100);
                matchDetails.salaryMatch = Math.round(salaryMatchPercentage);
                totalScore += (salaryMatchPercentage / 100) * 10;
            }
        }
        // 6. Working Type Match (5% weight)
        maxScore += 5;
        if (job.jobWorkingType === "remote" && talentSeeker.isOpenToRemote) {
            matchDetails.workingTypeMatch = 100;
            totalScore += 5;
        }
        else if (job.jobWorkingType === "hybrid") {
            matchDetails.workingTypeMatch = 80;
            totalScore += 4;
        }
        else {
            matchDetails.workingTypeMatch = 60;
            totalScore += 3;
        }
        // Calculate final percentage
        const matchPercentage = Math.round((totalScore / maxScore) * 100);
        // Determine match level
        let matchLevel = "Poor Match";
        if (matchPercentage >= 80)
            matchLevel = "Excellent Match";
        else if (matchPercentage >= 65)
            matchLevel = "Good Match";
        else if (matchPercentage >= 50)
            matchLevel = "Fair Match";
        // Generate AI-powered insights
        const aiInsights = await ai_service_1.default.generateMatchInsights({
            matchPercentage,
            matchLevel,
            matchDetails,
            jobTitle: job.title,
            talentSeekerSkills: talentSeeker.skills || [],
        });
        return new ApiResponse_1.ApiResponse(200, "Match score calculated successfully", {
            matchPercentage,
            matchLevel,
            matchDetails,
            job: {
                _id: job._id,
                title: job.title,
                company: job.talentFinderId?.company,
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
    async getRecommendedJobs(userId, queryParams) {
        // Find the talent seeker profile
        const talentSeeker = await talentSeeker_model_1.TalentSeekerModel.findOne({ userId });
        if (!talentSeeker) {
            throw new ApiError_1.ApiError(404, "Please complete your talent seeker profile to see recommendations");
        }
        const { page, skip, limit } = (0, dbHelpers_1.getPagination)({
            page: queryParams.page,
            limit: queryParams.limit,
        });
        // Build query based on talent seeker's profile
        const query = {
            status: "active",
        };
        // Match skills (if seeker has skills)
        if (talentSeeker.skills && talentSeeker.skills.length > 0) {
            query.skills = {
                $in: talentSeeker.skills.map((s) => new RegExp(s, "i")),
            };
        }
        // Match preferred job types
        if (talentSeeker.preferredJobTypes &&
            talentSeeker.preferredJobTypes.length > 0) {
            query.jobType = { $in: talentSeeker.preferredJobTypes };
        }
        // Match location or remote opportunities
        if (talentSeeker.location || talentSeeker.isOpenToRemote) {
            const locationConditions = [];
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
            job_model_1.JobModel.find(query)
                .populate("talentFinderId", "company location industry")
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .lean(),
            job_model_1.JobModel.countDocuments(query),
        ]);
        // Calculate match scores for each job
        const jobsWithScores = jobs.map((job) => {
            let matchScore = 0;
            // Quick skill match calculation
            if (job.skills &&
                job.skills.length > 0 &&
                talentSeeker.skills &&
                talentSeeker.skills.length > 0) {
                const jobSkillsLower = job.skills.map((s) => s.toLowerCase());
                const seekerSkillsLower = talentSeeker.skills.map((s) => s.toLowerCase());
                const matchingSkills = seekerSkillsLower.filter((skill) => jobSkillsLower.some((jobSkill) => jobSkill.includes(skill) || skill.includes(jobSkill)));
                matchScore = Math.round((matchingSkills.length / jobSkillsLower.length) * 100);
            }
            return {
                ...job,
                matchScore,
            };
        });
        // Sort by match score
        jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
        // Calculate average match score and top skills
        const avgMatchScore = jobsWithScores.length > 0
            ? Math.round(jobsWithScores.reduce((sum, job) => sum + job.matchScore, 0) /
                jobsWithScores.length)
            : 0;
        // Extract top skills from recommended jobs
        const skillFrequency = {};
        jobsWithScores.forEach((job) => {
            job.skills?.forEach((skill) => {
                skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
            });
        });
        const topSkills = Object.entries(skillFrequency)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([skill]) => skill);
        // Generate AI-powered summary
        const aiSummary = await ai_service_1.default.generateRecommendationSummary({
            totalJobs: total,
            topSkills,
            avgMatchScore,
            talentSeekerProfile: {
                skills: talentSeeker.skills,
                experience: talentSeeker.experience,
                preferredJobTypes: talentSeeker.preferredJobTypes,
            },
        });
        return new ApiResponse_1.ApiResponse(200, "Recommended jobs retrieved successfully", {
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
    async getMyApplications(userId) {
        const jobCandidate = await jobCandidate_model_1.JobCandidateModel.find({ userId }).populate("jobId");
        return new ApiResponse_1.ApiResponse(200, "Applications retrieved successfully", jobCandidate);
    },
    /**
     * CREATIVE FEATURE 1: AI-Powered Job Description Enhancement
     * POST /api/jobs/enhance-description
     */
    async enhanceJobDescription(data) {
        const enhancement = await ai_service_1.default.enhanceJobDescription(data);
        return new ApiResponse_1.ApiResponse(200, "Job description enhanced successfully", enhancement);
    },
    /**
     * CREATIVE FEATURE 3: AI Interview Questions Generator
     * GET /api/jobs/applications/:applicationId/interview-questions
     */
    async generateInterviewQuestions(applicationId, talentFinderId) {
        // Find the application with populated data
        const application = await jobCandidate_model_1.JobCandidateModel.findById(applicationId)
            .populate({
            path: "jobId",
            select: "title description skills experienceLevel talentFinderId",
        })
            .populate({
            path: "talentSeekerId",
            select: "skills experience",
        });
        if (!application) {
            throw new ApiError_1.ApiError(404, "Application not found");
        }
        const job = application.jobId;
        // Verify that the job belongs to this talent finder
        if (job.talentFinderId.toString() !== talentFinderId) {
            throw new ApiError_1.ApiError(403, "You are not authorized to generate questions for this application");
        }
        const talentSeeker = application.talentSeekerId;
        // Generate interview questions using AI
        const questions = await ai_service_1.default.generateInterviewQuestions({
            jobTitle: job.title,
            jobDescription: job.description,
            requiredSkills: job.skills || [],
            experienceLevel: job.experienceLevel,
            candidateSkills: talentSeeker.skills || [],
            candidateExperience: talentSeeker.experience || 0,
        });
        return new ApiResponse_1.ApiResponse(200, "Interview questions generated successfully", {
            applicationId: application._id,
            jobTitle: job.title,
            candidateName: talentSeeker.title || "Candidate",
            questions,
        });
    },
};
// Helper function to generate recommendations
function generateRecommendations(matchPercentage, matchDetails) {
    const recommendations = [];
    if (matchPercentage >= 80) {
        recommendations.push("🎉 This is an excellent match! You should definitely apply.");
    }
    else if (matchPercentage >= 65) {
        recommendations.push("✨ This is a good match for your profile. Consider applying!");
    }
    else if (matchPercentage >= 50) {
        recommendations.push("💡 This could be a good opportunity with some skill development.");
    }
    else {
        recommendations.push("⚠️ This job may not be the best fit, but you can still apply if interested.");
    }
    // Skills-based recommendations
    if (matchDetails.skillsMatch < 60 && matchDetails.missingSkills?.length > 0) {
        recommendations.push(`📚 Consider learning these skills to improve your match: ${matchDetails.missingSkills
            .slice(0, 3)
            .join(", ")}`);
    }
    else if (matchDetails.skillsMatch >= 80) {
        recommendations.push("✅ Your skills are a great match for this position!");
    }
    // Experience-based recommendations
    if (matchDetails.experienceMatch < 60) {
        recommendations.push("💼 You may be under/over-qualified for this position based on experience.");
    }
    // Salary-based recommendations
    if (matchDetails.salaryMatch < 70) {
        recommendations.push("💰 The salary range may not fully meet your expectations.");
    }
    // Location-based recommendations
    if (matchDetails.locationMatch < 50 && matchDetails.workingTypeMatch < 60) {
        recommendations.push("📍 Consider if you're willing to relocate or if remote work is negotiable.");
    }
    return recommendations;
}
//# sourceMappingURL=job.service.js.map