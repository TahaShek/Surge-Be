import { asyncHandler } from "utils";
import { TalentFinderService } from "./talentFinder.service";

export const TalentFinderController = {
  // Create Profile
  createProfile: asyncHandler(async (req, res) => {
    const response = await TalentFinderService.createProfile(
      req.user!._id.toString(),
      req.body
    );

    return res.status(response.status).json(response);
  }),

  // Update Profile
  updateProfile: asyncHandler(async (req, res) => {
    const response = await TalentFinderService.updateProfile(
      req.user!._id.toString(),
      req.body
    );

    return res.status(response.status).json(response);
  }),

  // Create or Update Profile
  createOrUpdateProfile: asyncHandler(async (req, res) => {
    const response = await TalentFinderService.createOrUpdateProfile(
      req.user!._id.toString(),
      req.body
    );

    return res.status(response.status).json(response);
  }),

  // Get My Profile
  getMyProfile: asyncHandler(async (req, res) => {
    const response = await TalentFinderService.getMyProfile(
      req.user!._id.toString()
    );

    return res.status(response.status).json(response);
  }),

  // Get Profile by ID (public)
  getProfileById: asyncHandler(async (req, res) => {
    const response = await TalentFinderService.getProfileById(req.params.id);

    return res.status(response.status).json(response);
  }),

  // Delete Profile
  deleteProfile: asyncHandler(async (req, res) => {
    const response = await TalentFinderService.deleteProfile(
      req.user!._id.toString()
    );

    return res.status(response.status).json(response);
  }),

  // List TalentFinders
  listTalentFinders: asyncHandler(async (req, res) => {
    const filters = {
      industry: req.query.industry as string,
      location: req.query.location as string,
      companySize: req.query.companySize as string,
      isVerifiedCompany: req.query.isVerifiedCompany === "true",
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
    };

    const response = await TalentFinderService.listTalentFinders(filters);

    return res.status(response.status).json(response);
  }),
};
