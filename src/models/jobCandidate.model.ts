import mongoose from "mongoose";
import {
  IJobCandidate,
  JobCandidateDocument,
  JobCandidateModelType,
} from "../@types/models/jobCandidate.types";

const jobCandidateSchema = new mongoose.Schema<IJobCandidate>(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    talentSeekerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TalentSeeker",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "screening", "interviewing", "offered", "rejected", "withdrawn", "hired"],
      default: "applied",
      required: true,
    },
    coverLetter: {
      type: String,
      trim: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "job_candidates",
  }
);

// Indexes
jobCandidateSchema.index({ jobId: 1 });
jobCandidateSchema.index({ appliedAt: -1 });
// Unique constraint: a talent seeker can only apply once to a job
jobCandidateSchema.index({ jobId: 1, talentSeekerId: 1 }, { unique: true });

export const JobCandidateModel = mongoose.model<
  IJobCandidate,
  mongoose.Model<IJobCandidate> & JobCandidateModelType
>("JobCandidate", jobCandidateSchema);
