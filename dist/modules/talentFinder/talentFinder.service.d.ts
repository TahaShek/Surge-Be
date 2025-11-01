import type { CreateTalentFinderData, UpdateTalentFinderData } from "./talentFinder.validator";
import { ApiResponse } from "../../utils";
import { ITalentFinder } from "../../@types/models/talentFinder.types";
import mongoose from "mongoose";
export declare const TalentFinderService: {
    createProfile(userId: string, data: CreateTalentFinderData): Promise<ApiResponse<ITalentFinder>>;
    updateProfile(userId: string, data: UpdateTalentFinderData): Promise<ApiResponse<ITalentFinder>>;
    createOrUpdateProfile(userId: string, data: CreateTalentFinderData): Promise<ApiResponse<ITalentFinder>>;
    getProfileByUserId(userId: string): Promise<ApiResponse<ITalentFinder>>;
    getProfileById(id: string): Promise<ApiResponse<ITalentFinder>>;
    getMyProfile(userId: string): Promise<ApiResponse<ITalentFinder>>;
    deleteProfile(userId: string): Promise<ApiResponse<unknown>>;
    listTalentFinders(filters: {
        industry?: string;
        location?: string;
        companySize?: string;
        isVerifiedCompany?: boolean;
        page?: number;
        limit?: number;
    }): Promise<ApiResponse<{
        profiles: (ITalentFinder & Required<{
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
//# sourceMappingURL=talentFinder.service.d.ts.map