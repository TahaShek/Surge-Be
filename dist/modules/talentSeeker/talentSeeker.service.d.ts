import type { CreateTalentSeekerData } from "./talentSeeker.validator";
import { ApiResponse } from "../../utils";
import { ITalentSeeker } from "../../@types/models/talentSeeker.types";
import mongoose from "mongoose";
export declare const TalentSeekerService: {
    createOrUpdateProfile(userId: string, data: CreateTalentSeekerData, resumeFile?: Express.Multer.File): Promise<ApiResponse<ITalentSeeker>>;
    getProfileByUserId(userId: string): Promise<ApiResponse<ITalentSeeker>>;
    getProfileById(id: string): Promise<ApiResponse<ITalentSeeker>>;
    getMyProfile(userId: string): Promise<ApiResponse<ITalentSeeker>>;
    deleteProfile(userId: string): Promise<ApiResponse<unknown>>;
    searchTalentSeekers(filters: {
        skills?: string[];
        availability?: string;
        location?: string;
        isOpenToRemote?: boolean;
        experienceMin?: number;
        experienceMax?: number;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<{
        profiles: (ITalentSeeker & Required<{
            _id: string | mongoose.Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>>;
};
//# sourceMappingURL=talentSeeker.service.d.ts.map