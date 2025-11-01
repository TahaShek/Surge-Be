import mongoose from "mongoose";
export interface IRoute {
    name: string;
    description?: string;
    coordinates: {
        latitude: number;
        longitude: number;
    }[];
    color?: string;
    weight?: number;
    distance?: number;
    duration?: number;
    createdBy: mongoose.Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const RouteModel: mongoose.Model<IRoute, {}, {}, {}, mongoose.Document<unknown, {}, IRoute, {}, {}> & IRoute & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
//# sourceMappingURL=route.model.d.ts.map