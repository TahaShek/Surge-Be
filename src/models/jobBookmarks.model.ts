import mongoose from "mongoose";

const jobBookmarksSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    talentSeekrId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TalentSeekr",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, collection: "job_bookmarks" }
);

export const JobBookmarksModel = mongoose.model(
  "JobBookmark",
  jobBookmarksSchema
);
