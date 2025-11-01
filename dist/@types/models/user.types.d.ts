import { HydratedDocument, Model } from "mongoose";
import { BaseDocument, Ref } from "./common";
import { IRole } from "./role.type";
export interface IUser extends BaseDocument {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    age?: number;
    avatar?: string;
    googleId?: string;
    role: Ref<IRole>[];
    refreshToken?: string;
    isVerified?: boolean;
    lastLoginAt?: Date;
}
export interface UserDocument extends HydratedDocument<IUser> {
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): Promise<string>;
    generateRefreshToken(): Promise<string>;
}
export interface UserModelType extends Model<IUser> {
    findByEmail(email: string): Promise<UserDocument | null>;
}
//# sourceMappingURL=user.types.d.ts.map