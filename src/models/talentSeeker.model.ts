import mongoose from "mongoose";
import {
  ITalentSeeker,
  TalentSeekerDocument,
  TalentSeekerModelType,
} from "../@types/models/talentSeeker.types";

const talentSeekerSchema = new mongoose.Schema<ITalentSeeker>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    title: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: {
      type: Number, // years
      min: 0,
    },
    education: [
      {
        degree: {
          type: String,
          required: true,
        },
        institution: {
          type: String,
          required: true,
        },
        year: {
          type: Number,
        },
      },
    ],
    portfolio: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    resume: {
      type: String,
      trim: true,
    },
    availability: {
      type: String,
      enum: ["available", "not-available", "open-to-offers"],
      default: "available",
    },
    expectedSalary: {
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    location: {
      type: String,
      trim: true,
    },
    isOpenToRemote: {
      type: Boolean,
      default: false,
    },
    preferredJobTypes: {
      type: [String],
      enum: ["full-time", "part-time", "contract", "freelance"],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "talent_seekers",
  }
);


export const TalentSeekerModel = mongoose.model<
  ITalentSeeker,
  mongoose.Model<ITalentSeeker> & TalentSeekerModelType
>("TalentSeeker", talentSeekerSchema);
