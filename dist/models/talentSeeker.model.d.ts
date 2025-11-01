import mongoose from "mongoose";
import { ITalentSeeker, TalentSeekerModelType } from "../@types/models/talentSeeker.types";
export declare const TalentSeekerModel: mongoose.Model<ITalentSeeker, {}, {}, {}, mongoose.Document<unknown, {}, ITalentSeeker, {}, {}> & ITalentSeeker & Required<{
    _id: string | mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any> & TalentSeekerModelType;
//# sourceMappingURL=talentSeeker.model.d.ts.map