import { asyncHandler } from "utils";
import { TalentSeekerService } from "./talentSeeker.service";

export const TalentSeekerController = {
  // Create or Update Profile
  createOrUpdateProfile: asyncHandler(async (req, res) => {
    const response = await TalentSeekerService.createOrUpdateProfile(
      req.user!._id.toString(),
      req.body
    );

    return res.status(response.status).json(response);
  }),

  // Get My Profile
  getMyProfile: asyncHandler(async (req, res) => {
    const response = await TalentSeekerService.getMyProfile(
      req.user!._id.toString()
    );

    return res.status(response.status).json(response);
  }),

  // Get Profile by ID (public)
  getProfileById: asyncHandler(async (req, res) => {
    const response = await TalentSeekerService.getProfileById(req.params.id);

    return res.status(response.status).json(response);
  }),

  // Delete Profile
  deleteProfile: asyncHandler(async (req, res) => {
    const response = await TalentSeekerService.deleteProfile(
      req.user!._id.toString()
    );

    return res.status(response.status).json(response);
  }),

  // Search TalentSeekers
  searchTalentSeekers: asyncHandler(async (req, res) => {
    const filters = {
      skills: req.query.skills
        ? (req.query.skills as string).split(",")
        : undefined,
      availability: req.query.availability as string,
      location: req.query.location as string,
      isOpenToRemote: req.query.isOpenToRemote === "true",
      experienceMin: req.query.experienceMin
        ? Number(req.query.experienceMin)
        : undefined,
      experienceMax: req.query.experienceMax
        ? Number(req.query.experienceMax)
        : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
    };

    const response = await TalentSeekerService.searchTalentSeekers(filters);

    return res.status(response.status).json(response);
  }),
};
