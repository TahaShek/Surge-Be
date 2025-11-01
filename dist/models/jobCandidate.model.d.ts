import mongoose from "mongoose";
import { IJobCandidate, JobCandidateModelType } from "../@types/models/jobCandidate.types";
export declare const JobCandidateModel: mongoose.Model<IJobCandidate, {}, {}, {}, mongoose.Document<unknown, {}, IJobCandidate, {}, {}> & IJobCandidate & Required<{
    _id: string | mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any> & JobCandidateModelType;
//# sourceMappingURL=jobCandidate.model.d.ts.map