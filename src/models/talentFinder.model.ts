import mongoose from "mongoose";
import {
  ITalentFinder,
  TalentFinderModelType,
} from "../@types/models/talentFinder.types";

const talentFinderSchema = new mongoose.Schema<ITalentFinder>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    company: {
      type: String,
      trim: true,
    },
    companySize: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
    },
    industry: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    isVerifiedCompany: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "talent_finders",
  }
);

export const TalentFinderModel = mongoose.model<
  ITalentFinder,
  mongoose.Model<ITalentFinder> & TalentFinderModelType
>("TalentFinder", talentFinderSchema);
