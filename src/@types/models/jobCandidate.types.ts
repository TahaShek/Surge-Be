import { BaseDocument, Ref } from "./common";
import { IJob } from "./job.types";
import { ITalentSeeker } from "./talentSeeker.types";

// JobCandidate - Connects TalentSeeker to Job (application)
export interface IJobCandidate extends BaseDocument {
  jobId: Ref<IJob>;
  talentSeekerId: Ref<ITalentSeeker>;
  status: "applied" | "shortlisted" | "accepted" | "rejected" | "withdrawn" | "hired";
  coverLetter?: string;
  appliedAt: Date;
  notes?: string; // Internal notes from recruiter
  resumeUrl?: string; // Specific resume for this application
  acceptedAt?: Date;
  rejectedAt?: Date;
}

export interface JobCandidateDocument extends IJobCandidate {}

export interface JobCandidateModelType {
  // Add custom static methods here if needed
}
