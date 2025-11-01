import mongoose from "mongoose";
export declare const JobBookmarksModel: mongoose.Model<{
    userId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
    talentSeekrId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
    talentSeekrId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
    collection: string;
}> & {
    userId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
    talentSeekrId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    collection: string;
}, {
    userId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
    talentSeekrId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    userId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
    talentSeekrId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps>, {}, mongoose.ResolveSchemaOptions<{
    timestamps: true;
    collection: string;
}>> & mongoose.FlatRecord<{
    userId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
    talentSeekrId: mongoose.Types.ObjectId;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=jobBookmarks.model.d.ts.map