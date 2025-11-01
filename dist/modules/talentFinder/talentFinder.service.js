"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalentFinderService = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const mongoose_1 = __importDefault(require("mongoose"));
exports.TalentFinderService = {
    // Create TalentFinder Profile
    async createProfile(userId, data) {
        // Check if profile already exists
        const existingProfile = await models_1.TalentFinderModel.findOne({ userId });
        if (existingProfile) {
            throw new utils_1.ApiError(409, "Talent Finder profile already exists. Use update endpoint instead.");
        }
        const profile = await models_1.TalentFinderModel.create({
            userId: new mongoose_1.default.Types.ObjectId(userId),
            ...data,
        });
        return new utils_1.ApiResponse(201, "Talent Finder profile created successfully", profile.toObject());
    },
    // Update TalentFinder Profile
    async updateProfile(userId, data) {
        const profile = await models_1.TalentFinderModel.findOne({ userId });
        if (!profile) {
            throw new utils_1.ApiError(404, "Talent Finder profile not found. Please create one first.");
        }
        Object.assign(profile, data);
        await profile.save();
        return new utils_1.ApiResponse(200, "Talent Finder profile updated successfully", profile.toObject());
    },
    // Create or Update TalentFinder Profile
    async createOrUpdateProfile(userId, data) {
        let profile = await models_1.TalentFinderModel.findOne({ userId });
        if (profile) {
            // Update existing profile
            Object.assign(profile, data);
            await profile.save();
            return new utils_1.ApiResponse(200, "Talent Finder profile updated successfully", profile.toObject());
        }
        else {
            // Create new profile
            profile = await models_1.TalentFinderModel.create({
                userId: new mongoose_1.default.Types.ObjectId(userId),
                ...data,
            });
            return new utils_1.ApiResponse(201, "Talent Finder profile created successfully", profile.toObject());
        }
    },
    // Get TalentFinder Profile by User ID
    async getProfileByUserId(userId) {
        const profile = await models_1.TalentFinderModel.findOne({ userId }).populate("userId", "firstName lastName email avatar");
        if (!profile) {
            throw new utils_1.ApiError(404, "Talent Finder profile not found");
        }
        return new utils_1.ApiResponse(200, "Talent Finder profile retrieved successfully", profile.toObject());
    },
    // Get TalentFinder Profile by ID
    async getProfileById(id) {
        const profile = await models_1.TalentFinderModel.findById(id).populate("userId", "firstName lastName email avatar");
        if (!profile) {
            throw new utils_1.ApiError(404, "Talent Finder profile not found");
        }
        return new utils_1.ApiResponse(200, "Talent Finder profile retrieved successfully", profile.toObject());
    },
    // Get Current User's Profile
    async getMyProfile(userId) {
        return this.getProfileByUserId(userId);
    },
    // Delete TalentFinder Profile
    async deleteProfile(userId) {
        const profile = await models_1.TalentFinderModel.findOneAndDelete({ userId });
        if (!profile) {
            throw new utils_1.ApiError(404, "Talent Finder profile not found");
        }
        return new utils_1.ApiResponse(200, "Talent Finder profile deleted successfully");
    },
    // List TalentFinders (Companies)
    async listTalentFinders(filters) {
        const { industry, location, companySize, isVerifiedCompany, page = 1, limit = 10, } = filters;
        const query = {};
        if (industry) {
            query.industry = { $regex: industry, $options: "i" };
        }
        if (location) {
            query.location = { $regex: location, $options: "i" };
        }
        if (companySize) {
            query.companySize = companySize;
        }
        if (isVerifiedCompany !== undefined) {
            query.isVerifiedCompany = isVerifiedCompany;
        }
        const skip = (page - 1) * limit;
        const [profiles, total] = await Promise.all([
            models_1.TalentFinderModel.find(query)
                .populate("userId", "firstName lastName email avatar")
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            models_1.TalentFinderModel.countDocuments(query),
        ]);
        return new utils_1.ApiResponse(200, "Talent Finders retrieved successfully", {
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
//# sourceMappingURL=talentFinder.service.js.map