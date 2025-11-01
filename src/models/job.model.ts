import mongoose from "mongoose";
import { IJob, JobDocument, JobModelType } from "../@types/models/job.types";

const jobSchema = new mongoose.Schema<IJob>(
  {
    talentFinderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TalentFinder",
      required: true,
    },
    jobCode: {
      type: String,
      unique: true,
      immutable: true,
      required: true,
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },
    requirements: {
      type: String,
    },
    responsibilities: {
      type: String,
    },
    skills: {
      type: [String],
      default: [],
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "freelance", "internship"],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "mid", "senior", "lead"],
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    jobWorkingType: {
      type: String,
      enum: ["remote", "on-site", "hybrid"],
      default: "remote",
    },
    salary: {
      min: Number,
      max: Number,
      currency: { type: String, default: "USD" },
    },
    benefits: {
      type: [String],
      default: [],
    },
    applicationDeadline: Date,
    status: {
      type: String,
      enum: ["draft", "active", "closed", "filled"],
      default: "draft",
    },
    applicantsCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    collection: "jobs",
  }
);

// Indexes
jobSchema.index({ talentFinderId: 1 });
jobSchema.index({ title: "text", description: "text" });
jobSchema.index({ createdAt: -1 });

// 🔹 Pre-save hook to auto-generate jobCode
jobSchema.pre<JobDocument>("validate", async function (next) {
  if (this.jobCode) return next(); // Skip if already set

  const lastJob = await mongoose.model("Job").findOne({}, { jobCode: 1 }).sort({ createdAt: -1 });
  const lastNumber = lastJob?.jobCode ? parseInt(lastJob.jobCode.split("-")[1]) : 0;
  const newNumber = (lastNumber + 1).toString().padStart(4, "0");

  this.jobCode = `JOB-${newNumber}`;
  next();
});

export const JobModel = mongoose.model<IJob, mongoose.Model<IJob> & JobModelType>(
  "Job",
  jobSchema
);
