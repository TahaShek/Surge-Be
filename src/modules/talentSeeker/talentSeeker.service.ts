import { TalentSeekerModel } from "models";
import type {
  CreateTalentSeekerData,
  UpdateTalentSeekerData,
} from "./talentSeeker.validator";
import { ApiError, ApiResponse } from "utils";
import { ITalentSeeker } from "../../@types/models/talentSeeker.types";
import mongoose from "mongoose";
import { CloudinaryService } from "../../services/cloudinary.service";

export const TalentSeekerService = {
  // Create or Update TalentSeeker Profile
  async createOrUpdateProfile(
    userId: string,
    data: CreateTalentSeekerData,
    resumeFile?: Express.Multer.File
  ) {
    // Check if profile already exists
    let profile = await TalentSeekerModel.findOne({ userId });

    // Upload resume to Cloudinary if provided
    if (resumeFile) {
      const resumeUrl = await CloudinaryService.uploadResume(
        resumeFile.buffer,
        userId,
        resumeFile.originalname
      );
      data.resume = resumeUrl;

      // Delete old resume from Cloudinary if updating
      if (profile?.resume) {
        await CloudinaryService.deleteFile(profile.resume);
      }
    }

    if (profile) {
      // Update existing profile
      Object.assign(profile, data);
      await profile.save();

      return new ApiResponse<ITalentSeeker>(
        200,
        "Talent Seeker profile updated successfully",
        profile.toObject()
      );
    } else {
      // Create new profile
      profile = await TalentSeekerModel.create({
        userId: new mongoose.Types.ObjectId(userId),
        ...data,
      });

      return new ApiResponse<ITalentSeeker>(
        201,
        "Talent Seeker profile created successfully",
        profile.toObject()
      );
    }
  },

  // Get TalentSeeker Profile by User ID
  async getProfileByUserId(userId: string) {
    const profile = await TalentSeekerModel.findOne({ userId }).populate(
      "userId",
      "firstName lastName email avatar"
    );

    if (!profile) {
      throw new ApiError(404, "Talent Seeker profile not found");
    }

    return new ApiResponse<ITalentSeeker>(
      200,
      "Talent Seeker profile retrieved successfully",
      profile.toObject()
    );
  },

  // Get TalentSeeker Profile by ID
  async getProfileById(id: string) {
    const profile = await TalentSeekerModel.findById(id).populate(
      "userId",
      "firstName lastName email avatar"
    );

    if (!profile) {
      throw new ApiError(404, "Talent Seeker profile not found");
    }

    return new ApiResponse<ITalentSeeker>(
      200,
      "Talent Seeker profile retrieved successfully",
      profile.toObject()
    );
  },

  // Get Current User's Profile
  async getMyProfile(userId: string) {
    return this.getProfileByUserId(userId);
  },

  // Delete TalentSeeker Profile
  async deleteProfile(userId: string) {
    const profile = await TalentSeekerModel.findOneAndDelete({ userId });

    if (!profile) {
      throw new ApiError(404, "Talent Seeker profile not found");
    }

    return new ApiResponse(200, "Talent Seeker profile deleted successfully");
  },

  // Search/List TalentSeekers (for recruiters)
  async searchTalentSeekers(filters: {
    skills?: string[];
    availability?: string;
    location?: string;
    isOpenToRemote?: boolean;
    experienceMin?: number;
    experienceMax?: number;
    page?: number;
    limit?: number;
  }) {
    const {
      skills,
      availability,
      location,
      isOpenToRemote,
      experienceMin,
      experienceMax,
      page = 1,
      limit = 10,
    } = filters;

    const query: any = {};

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
      TalentSeekerModel.find(query)
        .populate("userId", "firstName lastName email avatar")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      TalentSeekerModel.countDocuments(query),
    ]);

    return new ApiResponse(200, "Talent Seekers retrieved successfully", {
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
