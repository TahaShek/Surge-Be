import type { UserLoginData, UserLoginWithOtpData, UserOtpData, UserRegisterData, VerifyEmailQuery, ResendVerificationData, ForgotPasswordData, ResetPasswordData, RefreshTokenData } from "./auth.validator";
import { ApiResponse } from "../../utils";
import { IUser, UserDocument } from "../../@types/models/user.types";
export declare const AuthService: {
    register(data: UserRegisterData): Promise<ApiResponse<IUser>>;
    login(data: UserLoginData): Promise<{
        response: ApiResponse<IUser>;
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    loginWithOtp(data: UserLoginWithOtpData): Promise<ApiResponse<unknown>>;
    verifyOtp(data: UserOtpData): Promise<{
        response: ApiResponse<{
            user: IUser;
            tokens: {
                accessToken: string;
                refreshToken: string;
            };
        }>;
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    generateAccessAndRefreshToken(user: UserDocument): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    verifyEmail(query: VerifyEmailQuery): Promise<ApiResponse<unknown>>;
    resendVerification(data: ResendVerificationData): Promise<ApiResponse<unknown>>;
    forgotPassword(data: ForgotPasswordData): Promise<ApiResponse<unknown>>;
    resetPassword(data: ResetPasswordData): Promise<ApiResponse<unknown>>;
    logout(userId: string): Promise<ApiResponse<unknown>>;
    logoutAll(userId: string): Promise<ApiResponse<unknown>>;
    refreshToken(data: RefreshTokenData): Promise<{
        response: ApiResponse<unknown>;
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    getCurrentUser(userId: string): Promise<ApiResponse<IUser>>;
    getGoogleOAuthURL(): string;
    googleAuthCallback(code: string): Promise<{
        response: ApiResponse<IUser>;
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map