import { BaseDocument, Ref } from "./common";
import { IUser } from "./user.types";
export interface ITalentSeeker extends BaseDocument {
    userId: Ref<IUser>;
    title?: string;
    bio?: string;
    skills: string[];
    experience?: number;
    education?: {
        degree: string;
        institution: string;
        year?: number;
    }[];
    portfolio?: string;
    github?: string;
    linkedin?: string;
    resume?: string;
    availability?: "available" | "not-available" | "open-to-offers";
    expectedSalary?: {
        min: number;
        max: number;
        currency: string;
    };
    location?: string;
    isOpenToRemote?: boolean;
    preferredJobTypes?: ("full-time" | "part-time" | "contract" | "freelance")[];
}
export interface TalentSeekerDocument extends ITalentSeeker {
}
export interface TalentSeekerModelType {
}
//# sourceMappingURL=talentSeeker.types.d.ts.map