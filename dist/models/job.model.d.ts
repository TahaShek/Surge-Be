import mongoose from "mongoose";
import { IJob, JobModelType } from "../@types/models/job.types";
export declare const JobModel: mongoose.Model<IJob, {}, {}, {}, mongoose.Document<unknown, {}, IJob, {}, {}> & IJob & Required<{
    _id: string | mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any> & JobModelType;
//# sourceMappingURL=job.model.d.ts.map