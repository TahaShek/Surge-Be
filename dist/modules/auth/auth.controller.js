"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const utils_1 = require("../../utils");
const auth_service_1 = require("./auth.service");
const env_1 = require("../../config/env");
const options = {
    httpOnly: true,
    secure: false,
};
exports.AuthController = {
    register: (0, utils_1.asyncHandler)(async (req, res) => {
        const response = await auth_service_1.AuthService.register(req.body);
        return res.status(response.status).json(response);
    }),
    login: (0, utils_1.asyncHandler)(async (req, res) => {
        const { response, tokens } = await auth_service_1.AuthService.login(req.body);
        return res
            .status(response.status)
            .cookie("accessToken", tokens.accessToken, { ...options })
            .cookie("refreshToken", tokens.refreshToken, { ...options })
            .json(response);
    }),
    loginWithOtp: (0, utils_1.asyncHandler)(async (req, res) => {
        const response = await auth_service_1.AuthService.loginWithOtp(req.body);
        return res.status(response.status).json(response);
    }),
    verifyOtp: (0, utils_1.asyncHandler)(async (req, res) => {
        const { response, tokens } = await auth_service_1.AuthService.verifyOtp(req.body);
        return res
            .status(response.status)
            .cookie("accessToken", tokens.accessToken, { ...options })
            .cookie("refreshToken", tokens.refreshToken, { ...options })
            .json(response);
    }),
    linkedInAuth: (0, utils_1.asyncHandler)(async (req, res) => {
        const state = "asdasasddasd";
        const authUrl = `${env_1.config.LINKEDIN.auth_url}?response_type=code` +
            `&client_id=${env_1.config.LINKEDIN.client_id}` +
            `&redirect_uri=${encodeURIComponent(env_1.config.LINKEDIN.redirect_uri)}` +
            `&state=${state}` +
            `&scope=${encodeURIComponent(env_1.config.LINKEDIN.scope)}`;
        return res.status(200).redirect(authUrl);
    }),
    linkedInAuthCallback: (0, utils_1.asyncHandler)(async (req, res) => {
        // const response = await AuthService.linkedInAuthCallback(
        //   req.query as LinkedInAuthCallbackQuery
        // );
        return res.status(200).json();
    }),
    // Google OAuth 2.0
    googleAuth: (0, utils_1.asyncHandler)(async (req, res) => {
        const authUrl = auth_service_1.AuthService.getGoogleOAuthURL();
        return res.redirect(authUrl);
    }),
    googleAuthCallback: (0, utils_1.asyncHandler)(async (req, res) => {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Authorization code is required",
            });
        }
        const { response, tokens } = await auth_service_1.AuthService.googleAuthCallback(code);
        // Set cookies and redirect to frontend with tokens
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        return res
            .cookie("accessToken", tokens.accessToken, { ...options })
            .cookie("refreshToken", tokens.refreshToken, { ...options })
            .redirect(`${frontendUrl}/auth/success?message=${encodeURIComponent(response.message)}`);
    }),
    // Email Verification
    verifyEmail: (0, utils_1.asyncHandler)(async (req, res) => {
        const response = await auth_service_1.AuthService.verifyEmail(req.query);
        return res.status(response.status).json(response);
    }),
    resendVerification: (0, utils_1.asyncHandler)(async (req, res) => {
        const response = await auth_service_1.AuthService.resendVerification(req.body);
        return res.status(response.status).json(response);
    }),
    // Password Reset
    forgotPassword: (0, utils_1.asyncHandler)(async (req, res) => {
        const response = await auth_service_1.AuthService.forgotPassword(req.body);
        return res.status(response.status).json(response);
    }),
    resetPassword: (0, utils_1.asyncHandler)(async (req, res) => {
        const response = await auth_service_1.AuthService.resetPassword(req.body);
        return res.status(response.status).json(response);
    }),
    // Logout
    logout: (0, utils_1.asyncHandler)(async (req, res) => {
        const response = await auth_service_1.AuthService.logout(req.user._id.toString());
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(response.status).json(response);
    }),
    logoutAll: (0, utils_1.asyncHandler)(async (req, res) => {
        const response = await auth_service_1.AuthService.logoutAll(req.user._id.toString());
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(response.status).json(response);
    }),
    // Refresh Token
    refreshToken: (0, utils_1.asyncHandler)(async (req, res) => {
        const { response, tokens } = await auth_service_1.AuthService.refreshToken(req.body);
        return res
            .status(response.status)
            .cookie("accessToken", tokens.accessToken, { ...options })
            .cookie("refreshToken", tokens.refreshToken, { ...options })
            .json({
            statusCode: response.status,
            message: response.message,
            success: response.success,
            data: { tokens }
        });
    }),
    // Get Current User
    getCurrentUser: (0, utils_1.asyncHandler)(async (req, res) => {
        const response = await auth_service_1.AuthService.getCurrentUser(req.user._id.toString());
        return res.status(response.status).json(response);
    }),
};
//# sourceMappingURL=auth.controller.js.map