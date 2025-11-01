import { BaseDocument, Ref } from "./common";
import { IJob } from "./job.types";
import { ITalentSeeker } from "./talentSeeker.types";
export interface IJobCandidate extends BaseDocument {
    jobId: Ref<IJob>;
    talentSeekerId: Ref<ITalentSeeker>;
    status: "applied" | "shortlisted" | "accepted" | "rejected" | "withdrawn" | "hired";
    coverLetter?: string;
    appliedAt: Date;
    notes?: string;
    resumeUrl?: string;
    acceptedAt?: Date;
    rejectedAt?: Date;
}
export interface JobCandidateDocument extends IJobCandidate {
}
export interface JobCandidateModelType {
}
//# sourceMappingURL=jobCandidate.types.d.ts.map