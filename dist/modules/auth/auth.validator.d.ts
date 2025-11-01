import z from "zod";
declare const registerSchema: z.ZodObject<{
    body: z.ZodObject<{
        firstName: z.ZodString;
        lastName: z.ZodString;
        email: z.ZodEmail;
        password: z.ZodString;
        age: z.ZodOptional<z.ZodNumber>;
        avatar: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const loginSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const loginWithOtpSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodEmail;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const verifyOtpSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodEmail;
        otp: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const linkedInAuthCallbackSchema: z.ZodObject<{
    query: z.ZodObject<{
        code: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const googleAuthCallbackSchema: z.ZodObject<{
    query: z.ZodObject<{
        code: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const verifyEmailSchema: z.ZodObject<{
    query: z.ZodObject<{
        token: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const resendVerificationSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const forgotPasswordSchema: z.ZodObject<{
    body: z.ZodObject<{
        email: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const resetPasswordSchema: z.ZodObject<{
    body: z.ZodObject<{
        token: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
declare const refreshTokenSchema: z.ZodObject<{
    body: z.ZodObject<{
        refreshToken: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type UserRegisterData = z.infer<typeof registerSchema>["body"];
export type UserLoginData = z.infer<typeof loginSchema>["body"];
export type UserLoginWithOtpData = z.infer<typeof loginWithOtpSchema>["body"];
export type UserOtpData = z.infer<typeof verifyOtpSchema>["body"];
export type LinkedInAuthCallbackQuery = z.infer<typeof linkedInAuthCallbackSchema>["query"];
export type GoogleAuthCallbackQuery = z.infer<typeof googleAuthCallbackSchema>["query"];
export type VerifyEmailQuery = z.infer<typeof verifyEmailSchema>["query"];
export type ResendVerificationData = z.infer<typeof resendVerificationSchema>["body"];
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>["body"];
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>["body"];
export type RefreshTokenData = z.infer<typeof refreshTokenSchema>["body"];
export declare const AuthValidator: {
    registerSchema: z.ZodObject<{
        body: z.ZodObject<{
            firstName: z.ZodString;
            lastName: z.ZodString;
            email: z.ZodEmail;
            password: z.ZodString;
            age: z.ZodOptional<z.ZodNumber>;
            avatar: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    loginSchema: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodEmail;
            password: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    loginWithOtpSchema: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodEmail;
        }, z.core.$strip>;
    }, z.core.$strip>;
    verifyOtpSchema: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodEmail;
            otp: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    linkedInAuthCallbackSchema: z.ZodObject<{
        query: z.ZodObject<{
            code: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    googleAuthCallbackSchema: z.ZodObject<{
        query: z.ZodObject<{
            code: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    verifyEmailSchema: z.ZodObject<{
        query: z.ZodObject<{
            token: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    resendVerificationSchema: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    forgotPasswordSchema: z.ZodObject<{
        body: z.ZodObject<{
            email: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    resetPasswordSchema: z.ZodObject<{
        body: z.ZodObject<{
            token: z.ZodString;
            password: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    refreshTokenSchema: z.ZodObject<{
        body: z.ZodObject<{
            refreshToken: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
export {};
//# sourceMappingURL=auth.validator.d.ts.map