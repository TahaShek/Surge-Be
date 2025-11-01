import { TalentFinderModel } from "models";
import type {
  CreateTalentFinderData,
  UpdateTalentFinderData,
} from "./talentFinder.validator";
import { ApiError, ApiResponse } from "utils";
import { ITalentFinder } from "../../@types/models/talentFinder.types";
import mongoose from "mongoose";

export const TalentFinderService = {
  // Create TalentFinder Profile
  async createProfile(userId: string, data: CreateTalentFinderData) {
    // Check if profile already exists
    const existingProfile = await TalentFinderModel.findOne({ userId });

    if (existingProfile) {
      throw new ApiError(
        409,
        "Talent Finder profile already exists. Use update endpoint instead."
      );
    }

    const profile = await TalentFinderModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      ...data,
    });

    return new ApiResponse<ITalentFinder>(
      201,
      "Talent Finder profile created successfully",
      profile.toObject()
    );
  },

  // Update TalentFinder Profile
  async updateProfile(userId: string, data: UpdateTalentFinderData) {
    const profile = await TalentFinderModel.findOne({ userId });

    if (!profile) {
      throw new ApiError(
        404,
        "Talent Finder profile not found. Please create one first."
      );
    }

    Object.assign(profile, data);
    await profile.save();

    return new ApiResponse<ITalentFinder>(
      200,
      "Talent Finder profile updated successfully",
      profile.toObject()
    );
  },

  // Create or Update TalentFinder Profile
  async createOrUpdateProfile(userId: string, data: CreateTalentFinderData) {
    let profile = await TalentFinderModel.findOne({ userId });

    if (profile) {
      // Update existing profile
      Object.assign(profile, data);
      await profile.save();

      return new ApiResponse<ITalentFinder>(
        200,
        "Talent Finder profile updated successfully",
        profile.toObject()
      );
    } else {
      // Create new profile
      profile = await TalentFinderModel.create({
        userId: new mongoose.Types.ObjectId(userId),
        ...data,
      });

      return new ApiResponse<ITalentFinder>(
        201,
        "Talent Finder profile created successfully",
        profile.toObject()
      );
    }
  },

  // Get TalentFinder Profile by User ID
  async getProfileByUserId(userId: string) {
    const profile = await TalentFinderModel.findOne({ userId }).populate(
      "userId",
      "firstName lastName email avatar"
    );

    if (!profile) {
      throw new ApiError(404, "Talent Finder profile not found");
    }

    return new ApiResponse<ITalentFinder>(
      200,
      "Talent Finder profile retrieved successfully",
      profile.toObject()
    );
  },

  // Get TalentFinder Profile by ID
  async getProfileById(id: string) {
    const profile = await TalentFinderModel.findById(id).populate(
      "userId",
      "firstName lastName email avatar"
    );

    if (!profile) {
      throw new ApiError(404, "Talent Finder profile not found");
    }

    return new ApiResponse<ITalentFinder>(
      200,
      "Talent Finder profile retrieved successfully",
      profile.toObject()
    );
  },

  // Get Current User's Profile
  async getMyProfile(userId: string) {
    return this.getProfileByUserId(userId);
  },

  // Delete TalentFinder Profile
  async deleteProfile(userId: string) {
    const profile = await TalentFinderModel.findOneAndDelete({ userId });

    if (!profile) {
      throw new ApiError(404, "Talent Finder profile not found");
    }

    return new ApiResponse(200, "Talent Finder profile deleted successfully");
  },

  // List TalentFinders (Companies)
  async listTalentFinders(filters: {
    industry?: string;
    location?: string;
    companySize?: string;
    isVerifiedCompany?: boolean;
    page?: number;
    limit?: number;
  }) {
    const {
      industry,
      location,
      companySize,
      isVerifiedCompany,
      page = 1,
      limit = 10,
    } = filters;

    const query: any = {};

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
      TalentFinderModel.find(query)
        .populate("userId", "firstName lastName email avatar")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      TalentFinderModel.countDocuments(query),
    ]);

    return new ApiResponse(200, "Talent Finders retrieved successfully", {
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
