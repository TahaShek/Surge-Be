"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalentSeekerService = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_service_1 = require("../../services/cloudinary.service");
exports.TalentSeekerService = {
    // Create or Update TalentSeeker Profile
    async createOrUpdateProfile(userId, data, resumeFile) {
        // Check if profile already exists
        let profile = await models_1.TalentSeekerModel.findOne({ userId });
        // Upload resume to Cloudinary if provided
        if (resumeFile) {
            const resumeUrl = await cloudinary_service_1.CloudinaryService.uploadResume(resumeFile.buffer, userId, resumeFile.originalname);
            data.resume = resumeUrl;
            // Delete old resume from Cloudinary if updating
            if (profile?.resume) {
                await cloudinary_service_1.CloudinaryService.deleteFile(profile.resume);
            }
        }
        if (profile) {
            // Update existing profile
            Object.assign(profile, data);
            await profile.save();
            return new utils_1.ApiResponse(200, "Talent Seeker profile updated successfully", profile.toObject());
        }
        else {
            // Create new profile
            profile = await models_1.TalentSeekerModel.create({
                userId: new mongoose_1.default.Types.ObjectId(userId),
                ...data,
            });
            return new utils_1.ApiResponse(201, "Talent Seeker profile created successfully", profile.toObject());
        }
    },
    // Get TalentSeeker Profile by User ID
    async getProfileByUserId(userId) {
        const profile = await models_1.TalentSeekerModel.findOne({ userId }).populate("userId", "firstName lastName email avatar");
        if (!profile) {
            throw new utils_1.ApiError(404, "Talent Seeker profile not found");
        }
        return new utils_1.ApiResponse(200, "Talent Seeker profile retrieved successfully", profile.toObject());
    },
    // Get TalentSeeker Profile by ID
    async getProfileById(id) {
        const profile = await models_1.TalentSeekerModel.findById(id).populate("userId", "firstName lastName email avatar");
        if (!profile) {
            throw new utils_1.ApiError(404, "Talent Seeker profile not found");
        }
        return new utils_1.ApiResponse(200, "Talent Seeker profile retrieved successfully", profile.toObject());
    },
    // Get Current User's Profile
    async getMyProfile(userId) {
        return this.getProfileByUserId(userId);
    },
    // Delete TalentSeeker Profile
    async deleteProfile(userId) {
        const profile = await models_1.TalentSeekerModel.findOneAndDelete({ userId });
        if (!profile) {
            throw new utils_1.ApiError(404, "Talent Seeker profile not found");
        }
        return new utils_1.ApiResponse(200, "Talent Seeker profile deleted successfully");
    },
    // Search/List TalentSeekers (for recruiters)
    async searchTalentSeekers(filters) {
        const { skills, availability, location, isOpenToRemote, experienceMin, experienceMax, page = 1, limit = 10, } = filters;
        const query = {};
        if (skills && skills.length > 0) {
            query.skills = { $in: skills };
        }
        if (availability) {
            query.availability = availability;
        }
        if (location) {
            query.location = { $regex: location, $options: "i" };
        }
        if (isOpenToRemote !== undefined) {
            query.isOpenToRemote = isOpenToRemote;
        }
        if (experienceMin !== undefined || experienceMax !== undefined) {
            query.experience = {};
            if (experienceMin !== undefined) {
                query.experience.$gte = experienceMin;
            }
            if (experienceMax !== undefined) {
                query.experience.$lte = experienceMax;
            }
        }
        const skip = (page - 1) * limit;
        const [profiles, total] = await Promise.all([
            models_1.TalentSeekerModel.find(query)
                .populate("userId", "firstName lastName email avatar")
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            models_1.TalentSeekerModel.countDocuments(query),
        ]);
        return new utils_1.ApiResponse(200, "Talent Seekers retrieved successfully", {
            profiles: profiles.map((p) => p.toObject()),
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    },
};
//# sourceMappingURL=talentSeeker.service.js.map