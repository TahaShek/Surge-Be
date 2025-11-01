import { BaseDocument, Ref } from "./common";
import { IUser } from "./user.types";
export interface ITalentFinder extends BaseDocument {
    userId: Ref<IUser>;
    company?: string;
    companySize?: string;
    industry?: string;
    website?: string;
    description?: string;
    location?: string;
    isVerifiedCompany?: boolean;
}
export interface TalentFinderDocument extends ITalentFinder {
}
export interface TalentFinderModelType {
}
//# sourceMappingURL=talentFinder.types.d.ts.map