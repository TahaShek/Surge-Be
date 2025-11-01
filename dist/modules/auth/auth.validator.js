"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidator = void 0;
const zod_1 = __importDefault(require("zod"));
// === SCHEMAS ===
const registerSchema = zod_1.default.object({
    body: zod_1.default.object({
        firstName: zod_1.default.string().min(1, "First Name is required").max(20).trim(),
        lastName: zod_1.default.string().min(1, "Last Name is required").max(20).trim(),
        email: zod_1.default.email(),
        password: zod_1.default.string().min(6).max(20),
        age: zod_1.default.number().min(12).max(100).optional(),
        avatar: zod_1.default.string().optional(),
    }),
});
const loginSchema = zod_1.default.object({
    body: zod_1.default.object({
        email: zod_1.default.email(),
        password: zod_1.default.string().min(6).max(20),
    }),
});
const loginWithOtpSchema = zod_1.default.object({
    body: zod_1.default.object({
        email: zod_1.default.email(),
    }),
});
const verifyOtpSchema = zod_1.default.object({
    body: zod_1.default.object({
        email: zod_1.default.email(),
        otp: zod_1.default.string().length(6),
    }),
});
const linkedInAuthCallbackSchema = zod_1.default.object({
    query: zod_1.default.object({
        code: zod_1.default.string(),
    }),
});
const googleAuthCallbackSchema = zod_1.default.object({
    query: zod_1.default.object({
        code: zod_1.default.string().min(1, "Authorization code is required"),
    }),
});
const verifyEmailSchema = zod_1.default.object({
    query: zod_1.default.object({
        token: zod_1.default.string().min(1, "Token is required"),
    }),
});
const resendVerificationSchema = zod_1.default.object({
    body: zod_1.default.object({
        email: zod_1.default.string().email("Invalid email format"),
    }),
});
const forgotPasswordSchema = zod_1.default.object({
    body: zod_1.default.object({
        email: zod_1.default.string().email("Invalid email format"),
    }),
});
const resetPasswordSchema = zod_1.default.object({
    body: zod_1.default.object({
        token: zod_1.default.string().min(1, "Token is required"),
        password: zod_1.default
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(100, "Password too long")
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "Password must contain uppercase, lowercase, number and special character"),
    }),
});
const refreshTokenSchema = zod_1.default.object({
    body: zod_1.default.object({
        refreshToken: zod_1.default.string().min(1, "Refresh token is required"),
    }),
});
// === GROUPED SCHEMAS ===
exports.AuthValidator = {
    registerSchema,
    loginSchema,
    loginWithOtpSchema,
    verifyOtpSchema,
    linkedInAuthCallbackSchema,
    googleAuthCallbackSchema,
    verifyEmailSchema,
    resendVerificationSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    refreshTokenSchema,
};
//# sourceMappingURL=auth.validator.js.map