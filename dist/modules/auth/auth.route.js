"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const utils_1 = require("../../utils");
const auth_validator_1 = require("./auth.validator");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
router.post("/register", (0, utils_1.validateResource)(auth_validator_1.AuthValidator.registerSchema), auth_controller_1.AuthController.register);
router.post("/login", (0, utils_1.validateResource)(auth_validator_1.AuthValidator.loginSchema), auth_controller_1.AuthController.login);
router.post("/login-with-otp", (0, utils_1.validateResource)(auth_validator_1.AuthValidator.loginWithOtpSchema), auth_controller_1.AuthController.loginWithOtp);
router.post("/verify-otp", (0, utils_1.validateResource)(auth_validator_1.AuthValidator.verifyOtpSchema), auth_controller_1.AuthController.verifyOtp);
// OAuth 2.0
router.get("/linkedin", auth_controller_1.AuthController.linkedInAuth);
router.get("/linkedin/callback", auth_controller_1.AuthController.linkedInAuthCallback);
// Google OAuth 2.0
router.get("/google", auth_controller_1.AuthController.googleAuth);
router.get("/google/callback", (0, utils_1.validateResource)(auth_validator_1.AuthValidator.googleAuthCallbackSchema), auth_controller_1.AuthController.googleAuthCallback);
// Email Verification
router.get("/verify-email", (0, utils_1.validateResource)(auth_validator_1.AuthValidator.verifyEmailSchema), auth_controller_1.AuthController.verifyEmail);
router.post("/resend-verification", (0, utils_1.validateResource)(auth_validator_1.AuthValidator.resendVerificationSchema), auth_controller_1.AuthController.resendVerification);
// Password Reset
router.post("/forgot-password", (0, utils_1.validateResource)(auth_validator_1.AuthValidator.forgotPasswordSchema), auth_controller_1.AuthController.forgotPassword);
router.post("/reset-password", (0, utils_1.validateResource)(auth_validator_1.AuthValidator.resetPasswordSchema), auth_controller_1.AuthController.resetPassword);
// Logout (requires auth)
router.post("/logout", auth_middleware_1.verifyJWT, auth_controller_1.AuthController.logout);
router.post("/logout-all", auth_middleware_1.verifyJWT, auth_controller_1.AuthController.logoutAll);
// Refresh Token
router.post("/refresh-token", (0, utils_1.validateResource)(auth_validator_1.AuthValidator.refreshTokenSchema), auth_controller_1.AuthController.refreshToken);
// Get Current User (requires auth)
router.get("/me", auth_middleware_1.verifyJWT, auth_controller_1.AuthController.getCurrentUser);
exports.default = router;
//# sourceMappingURL=auth.route.js.map