import mongoose from "mongoose";
export interface ILocation {
    name: string;
    description?: string;
    latitude: number;
    longitude: number;
    category?: string;
    icon?: string;
    metadata?: {
        address?: string;
        phone?: string;
        website?: string;
        rating?: number;
        [key: string]: unknown;
    };
    createdBy: mongoose.Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const LocationModel: mongoose.Model<ILocation, {}, {}, {}, mongoose.Document<unknown, {}, ILocation, {}, {}> & ILocation & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
//# sourceMappingURL=location.model.d.ts.map