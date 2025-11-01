import mongoose, { Document } from 'mongoose';
export interface IVerificationToken {
    userId: mongoose.Types.ObjectId;
    token: string;
    type: 'email_verification' | 'password_reset';
    expiresAt: Date;
    createdAt: Date;
}
export interface IVerificationTokenDocument extends Document, IVerificationToken {
    _id: mongoose.Types.ObjectId;
}
interface VerificationTokenModel extends mongoose.Model<IVerificationToken> {
    createVerificationToken(userId: mongoose.Types.ObjectId, type: 'email_verification' | 'password_reset'): Promise<IVerificationTokenDocument>;
    verifyToken(token: string, type: 'email_verification' | 'password_reset'): Promise<IVerificationTokenDocument | null>;
}
export declare const VerificationTokenModel: VerificationTokenModel;
export {};
//# sourceMappingURL=verification-token.model.d.ts.map