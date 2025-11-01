import { asyncHandler } from "utils";
import { AuthService } from "./auth.service";
import { config } from "config/env";
import { GoogleAuthCallbackQuery, LinkedInAuthCallbackQuery } from "./auth.validator";

const options = {
  httpOnly: true,
  secure: false,
};

export const AuthController = {
  register: asyncHandler(async (req, res) => {
    const response = await AuthService.register(req.body);

    return res.status(response.status).json(response);
  }),

  login: asyncHandler(async (req, res) => {
    const { response, tokens } = await AuthService.login(req.body);

    return res
      .status(response.status)
      .cookie("accessToken", tokens.accessToken, { ...options })
      .cookie("refreshToken", tokens.refreshToken, { ...options })
      .json(response);
  }),

  loginWithOtp: asyncHandler(async (req, res) => {
    const response = await AuthService.loginWithOtp(req.body);

    return res.status(response.status).json(response);
  }),

  verifyOtp: asyncHandler(async (req, res) => {
    const { response, tokens } = await AuthService.verifyOtp(req.body);

    return res
      .status(response.status)
      .cookie("accessToken", tokens.accessToken, { ...options })
      .cookie("refreshToken", tokens.refreshToken, { ...options })
      .json(response);
  }),

  linkedInAuth: asyncHandler(async (req, res) => {
    const state = "asdasasddasd";
    const authUrl =
      `${config.LINKEDIN.auth_url}?response_type=code` +
      `&client_id=${config.LINKEDIN.client_id}` +
      `&redirect_uri=${encodeURIComponent(config.LINKEDIN.redirect_uri)}` +
      `&state=${state}` +
      `&scope=${encodeURIComponent(config.LINKEDIN.scope)}`;

    return res.status(200).redirect(authUrl);
  }),

  linkedInAuthCallback: asyncHandler(async (req, res) => {
    // const response = await AuthService.linkedInAuthCallback(
    //   req.query as LinkedInAuthCallbackQuery
    // );

    return res.status(200).json();
  }),

  // Google OAuth 2.0
  googleAuth: asyncHandler(async (req, res) => {
    const authUrl = AuthService.getGoogleOAuthURL();
    return res.redirect(authUrl);
  }),

  googleAuthCallback: asyncHandler(async (req, res) => {
    const { code } = req.query as GoogleAuthCallbackQuery;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Authorization code is required",
      });
    }

    const { response, tokens } = await AuthService.googleAuthCallback(code);

    // Set cookies and redirect to frontend with tokens
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    
    return res
      .cookie("accessToken", tokens.accessToken, { ...options })
      .cookie("refreshToken", tokens.refreshToken, { ...options })
      .redirect(`${frontendUrl}/auth/success?message=${encodeURIComponent(response.message)}`);
  }),

  // Email Verification
  verifyEmail: asyncHandler(async (req, res) => {
    const response = await AuthService.verifyEmail(req.query as { token: string });

    return res.status(response.status).json(response);
  }),

  resendVerification: asyncHandler(async (req, res) => {
    const response = await AuthService.resendVerification(req.body);

    return res.status(response.status).json(response);
  }),

  // Password Reset
  forgotPassword: asyncHandler(async (req, res) => {
    const response = await AuthService.forgotPassword(req.body);

    return res.status(response.status).json(response);
  }),

  resetPassword: asyncHandler(async (req, res) => {
    const response = await AuthService.resetPassword(req.body);

    return res.status(response.status).json(response);
  }),

  // Logout
  logout: asyncHandler(async (req, res) => {
    const response = await AuthService.logout(req.user!._id.toString());

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(response.status).json(response);
  }),

  logoutAll: asyncHandler(async (req, res) => {
    const response = await AuthService.logoutAll(req.user!._id.toString());

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(response.status).json(response);
  }),

  // Refresh Token
  refreshToken: asyncHandler(async (req, res) => {
    const { response, tokens } = await AuthService.refreshToken(req.body);

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
  getCurrentUser: asyncHandler(async (req, res) => {
    const response = await AuthService.getCurrentUser(req.user!._id.toString());

    return res.status(response.status).json(response);
  }),
};
