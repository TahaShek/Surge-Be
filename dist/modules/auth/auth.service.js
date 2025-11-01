"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const utils_2 = require("../../utils");
const otp_service_1 = require("../../services/otp.service");
const env_1 = require("../../config/env");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const queue_service_1 = require("../../services/queue.service");
const googleapis_1 = require("googleapis");
const crypto_1 = __importDefault(require("crypto"));
const enum_1 = require("../../@types/enum");
exports.AuthService = {
    async register(data) {
        // validate existence
        const doesUserExist = await models_1.UserModel.findByEmail(data.email);
        if (doesUserExist) {
            throw new utils_1.ApiError(409, (0, utils_2.t)("USER.EXISTS"));
        }
        const styles = ["bottts", "adventurer", "shapes", "identicon", "pixel-art"];
        const randomStyle = styles[Math.floor(Math.random() * styles.length)];
        const seed = data.email || crypto_1.default.randomBytes(8).toString("hex");
        const avatarUrl = `https://api.dicebear.com/9.x/${randomStyle}/svg?seed=${encodeURIComponent(seed)}`;
        const roles = await models_1.RoleModel.find({
            name: { $in: [enum_1.UserRoleEnum.TALENT_FINDER, enum_1.UserRoleEnum.TALENT_SEEKER] },
        });
        // 🧍‍♂️ Create user with both roles
        const user = await models_1.UserModel.create({
            ...data,
            avatar: avatarUrl,
            role: roles.map((r) => r._id),
        });
        await Promise.all([
            models_1.TalentFinderModel.create({
                userId: user._id,
            }),
            models_1.TalentSeekerModel.create({
                userId: user._id,
            }),
        ]);
        // Generate email verification token
        const verificationToken = await models_1.VerificationTokenModel.createVerificationToken(user._id, "email_verification");
        // Send verification email (async - don't wait)
        const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/verify-email?token=${verificationToken.token}`;
        await queue_service_1.QueueService.getQueue("otpQueue")?.add("sendVerificationEmail", {
            email: user.email,
            name: user.firstName,
            verificationUrl: verificationUrl,
        });
        return new utils_1.ApiResponse(201, "Registration successful! Please check your email to verify your account.", user.toObject());
    },
    async login(data) {
        // validate creds
        const user = await models_1.UserModel.findByEmail(data.email);
        if (!user) {
            throw new utils_1.ApiError(404, (0, utils_2.t)("USER.NOT_FOUND_AGAINST_EMAIL"));
        }
        const isValidPassword = await user.isPasswordCorrect(data.password);
        if (!isValidPassword) {
            throw new utils_1.ApiError(400, (0, utils_2.t)("USER.INCORRECT_PASSWORD"));
        }
        // Check if email is verified
        if (!user.isVerified) {
            throw new utils_1.ApiError(403, "Please verify your email before logging in. Check your inbox for the verification link.");
        }
        user.lastLoginAt = new Date();
        await user.save();
        const tokens = await this.generateAccessAndRefreshToken(user);
        return {
            response: new utils_1.ApiResponse(200, (0, utils_2.t)("AUTH.LOG_IN"), user),
            tokens: { ...tokens },
        };
    },
    async loginWithOtp(data) {
        const user = await models_1.UserModel.findByEmail(data.email);
        if (!user) {
            throw new utils_1.ApiError(404, (0, utils_2.t)("USER.NOT_FOUND_AGAINST_EMAIL"));
        }
        await otp_service_1.OtpService.sendOtp(data.email);
        return new utils_1.ApiResponse(200, (0, utils_2.t)("OTP.OTP_SENT"));
    },
    async verifyOtp(data) {
        const storedOtp = await otp_service_1.OtpService.getOtp(data.email);
        if (!storedOtp) {
            throw new utils_1.ApiError(400, (0, utils_2.t)("OTP.OTP_EXPIRED"));
        }
        if (storedOtp !== data.otp) {
            throw new utils_1.ApiError(400, (0, utils_2.t)("OTP.OTP_INVALID"));
        }
        await otp_service_1.OtpService.deleteOtp(data.email);
        // OTP valid → Log user in
        const user = await models_1.UserModel.findOne({ email: data.email }).populate("role");
        if (!user)
            throw new utils_1.ApiError(404, (0, utils_2.t)("USER.NOT_FOUND_AGAINST_EMAIL"));
        // Check if email is verified
        if (!user.isVerified) {
            throw new utils_1.ApiError(403, "Please verify your email before logging in. Check your inbox for the verification link.");
        }
        const tokens = await this.generateAccessAndRefreshToken(user);
        return {
            response: new utils_1.ApiResponse(200, (0, utils_2.t)("OTP.OTP_VERIFIED"), { user, tokens }),
            tokens,
        };
    },
    // async linkedInAuthCallback(query: LinkedInAuthCallbackQuery) {
    //   const { code } = query;
    //   // Exchange code for access token
    //   const tokenResponse = await axios.post(
    //     config.LINKEDIN.token_url,
    //     new URLSearchParams({
    //       grant_type: "authorization_code",
    //       code: code as string,
    //       redirect_uri: config.LINKEDIN.redirect_uri,
    //       client_id: config.LINKEDIN.client_id,
    //       client_secret: config.LINKEDIN.client_secret,
    //     }).toString(),
    //     {
    //       headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //     }
    //   );
    //   const accessToken = tokenResponse.data.access_token;
    //   const profileResponse = await axios.get("https://api.linkedin.com/v2/me", {
    //     headers: { Authorization: `Bearer ${accessToken}` },
    //   });
    //   const profile = profileResponse.data;
    //   console.log("LinkedIn Access Token:", accessToken);
    //   console.log("LinkedIn Profile:", profile);
    //   return new ApiResponse(200, t("AUTH.LOG_IN"));
    // },
    async generateAccessAndRefreshToken(user) {
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save();
        return { accessToken, refreshToken };
    },
    // Email Verification
    async verifyEmail(query) {
        const { token } = query;
        const tokenDoc = await models_1.VerificationTokenModel.verifyToken(token, "email_verification");
        if (!tokenDoc) {
            throw new utils_1.ApiError(400, "Invalid or expired verification token");
        }
        const user = await models_1.UserModel.findById(tokenDoc.userId);
        if (!user) {
            throw new utils_1.ApiError(404, (0, utils_2.t)("USER.NOT_FOUND"));
        }
        if (user.isVerified) {
            throw new utils_1.ApiError(400, "Email already verified");
        }
        user.isVerified = true;
        await user.save();
        // Delete used token
        await models_1.VerificationTokenModel.deleteOne({ _id: tokenDoc._id });
        return new utils_1.ApiResponse(200, "Email verified successfully! You can now log in.");
    },
    async resendVerification(data) {
        const user = await models_1.UserModel.findByEmail(data.email);
        if (!user) {
            throw new utils_1.ApiError(404, (0, utils_2.t)("USER.NOT_FOUND_AGAINST_EMAIL"));
        }
        if (user.isVerified) {
            throw new utils_1.ApiError(400, "Email already verified");
        }
        // Generate new token
        const verificationToken = await models_1.VerificationTokenModel.createVerificationToken(user._id, "email_verification");
        // Send verification email
        const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/verify-email?token=${verificationToken.token}`;
        await queue_service_1.QueueService.getQueue("otpQueue")?.add("sendVerificationEmail", {
            email: user.email,
            name: user.firstName,
            token: verificationUrl,
        });
        return new utils_1.ApiResponse(200, "Verification email sent! Please check your inbox.");
    },
    // Password Reset
    async forgotPassword(data) {
        const user = await models_1.UserModel.findByEmail(data.email);
        if (!user) {
            // Don't reveal if user exists - security best practice
            return new utils_1.ApiResponse(200, "If an account exists with this email, a password reset link has been sent.");
        }
        console.log("going");
        // Generate reset token
        const resetToken = await models_1.VerificationTokenModel.createVerificationToken(user._id, "password_reset");
        // Send reset email
        const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/auth/reset-password?token=${resetToken.token}`;
        await queue_service_1.QueueService.getQueue("otpQueue")?.add("sendVerificationEmail", {
            email: user.email,
            name: user.firstName,
            verificationUrl: resetUrl,
        });
        return new utils_1.ApiResponse(200, "If an account exists with this email, a password reset link has been sent.");
    },
    async resetPassword(data) {
        const { token, password } = data;
        const tokenDoc = await models_1.VerificationTokenModel.verifyToken(token, "password_reset");
        if (!tokenDoc) {
            throw new utils_1.ApiError(400, "Invalid or expired reset token");
        }
        const user = await models_1.UserModel.findById(tokenDoc.userId).select("+password");
        if (!user) {
            throw new utils_1.ApiError(404, (0, utils_2.t)("USER.NOT_FOUND"));
        }
        // Update password (will be hashed by pre-save hook)
        user.password = password;
        user.refreshToken = undefined; // Invalidate all sessions
        await user.save();
        // Delete used token
        await models_1.VerificationTokenModel.deleteOne({ _id: tokenDoc._id });
        return new utils_1.ApiResponse(200, "Password reset successful! You can now log in with your new password.");
    },
    // Logout
    async logout(userId) {
        const user = await models_1.UserModel.findById(userId);
        if (!user) {
            throw new utils_1.ApiError(404, (0, utils_2.t)("USER.NOT_FOUND"));
        }
        user.refreshToken = undefined;
        await user.save();
        return new utils_1.ApiResponse(200, "Logged out successfully");
    },
    async logoutAll(userId) {
        const user = await models_1.UserModel.findById(userId);
        if (!user) {
            throw new utils_1.ApiError(404, (0, utils_2.t)("USER.NOT_FOUND"));
        }
        user.refreshToken = undefined;
        await user.save();
        return new utils_1.ApiResponse(200, "Logged out from all devices successfully");
    },
    // Refresh Token
    async refreshToken(data) {
        const { refreshToken } = data;
        if (!refreshToken) {
            throw new utils_1.ApiError(401, "Refresh token required");
        }
        // Verify refresh token
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(refreshToken, env_1.config.JWT.refreshToken.secret);
        }
        catch (error) {
            throw new utils_1.ApiError(401, "Invalid or expired refresh token");
        }
        // Find user and check if refresh token matches (cast to UserDocument)
        const user = (await models_1.UserModel.findById(decoded._id));
        if (!user || user.refreshToken !== refreshToken) {
            throw new utils_1.ApiError(401, "Invalid refresh token");
        }
        // Generate new tokens
        const tokens = await this.generateAccessAndRefreshToken(user);
        return {
            response: new utils_1.ApiResponse(200, "Token refreshed successfully"),
            tokens,
        };
    },
    // Get current user
    async getCurrentUser(userId) {
        const user = await models_1.UserModel.findById(userId).populate("role");
        if (!user) {
            throw new utils_1.ApiError(404, (0, utils_2.t)("USER.NOT_FOUND"));
        }
        return new utils_1.ApiResponse(200, "User retrieved successfully", user.toObject());
    },
    // Google OAuth 2.0
    getGoogleOAuthURL() {
        const oauth2Client = new googleapis_1.google.auth.OAuth2(env_1.config.GOOGLE.client_id, env_1.config.GOOGLE.client_secret, env_1.config.GOOGLE.redirect_uri);
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: env_1.config.GOOGLE.scopes,
            prompt: "consent",
        });
        return authUrl;
    },
    async googleAuthCallback(code) {
        // Initialize OAuth2 client
        const oauth2Client = new googleapis_1.google.auth.OAuth2(env_1.config.GOOGLE.client_id, env_1.config.GOOGLE.client_secret, env_1.config.GOOGLE.redirect_uri);
        // Exchange authorization code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        // Get user info from Google
        const oauth2 = googleapis_1.google.oauth2({ version: "v2", auth: oauth2Client });
        const { data } = await oauth2.userinfo.get();
        if (!data.email) {
            throw new utils_1.ApiError(400, "Unable to retrieve email from Google");
        }
        // Check if user exists with this Google ID
        let user = (await models_1.UserModel.findOne({
            googleId: data.id,
        }));
        if (!user) {
            // Check if user exists with this email
            user = (await models_1.UserModel.findOne({
                email: data.email,
            }));
            if (user) {
                // Link Google account to existing user
                if (data.id) {
                    user.googleId = data.id;
                }
                user.isVerified = true; // Email is verified by Google
                if (data.picture && !user.avatar) {
                    user.avatar = data.picture;
                }
            }
            else {
                const roles = await models_1.RoleModel.find({
                    name: {
                        $in: [enum_1.UserRoleEnum.TALENT_FINDER, enum_1.UserRoleEnum.TALENT_SEEKER],
                    },
                });
                // 🎲 Dicebear avatar fallback if no Google picture
                const styles = [
                    "bottts",
                    "adventurer",
                    "shapes",
                    "identicon",
                    "pixel-art",
                ];
                const randomStyle = styles[Math.floor(Math.random() * styles.length)];
                const seed = data.email || crypto_1.default.randomBytes(8).toString("hex");
                const avatarUrl = data.picture ||
                    `https://api.dicebear.com/9.x/${randomStyle}/svg?seed=${encodeURIComponent(seed)}`;
                user = (await models_1.UserModel.create({
                    firstName: data.given_name || data.name?.split(" ")[0] || "User",
                    lastName: data.family_name || data.name?.split(" ")[1] || "",
                    email: data.email,
                    googleId: data.id,
                    avatar: avatarUrl,
                    roles: roles.map((r) => r._id),
                    isVerified: true,
                }));
            }
            await user.save();
        }
        // Update last login
        user.lastLoginAt = new Date();
        await user.save();
        // Generate tokens
        const authTokens = await this.generateAccessAndRefreshToken(user);
        return {
            response: new utils_1.ApiResponse(200, "Google authentication successful", user.toObject()),
            tokens: authTokens,
        };
    },
};
//# sourceMappingURL=auth.service.js.map