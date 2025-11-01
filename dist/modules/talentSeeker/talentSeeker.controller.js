"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalentSeekerController = void 0;
const utils_1 = require("../../utils");
const talentSeeker_service_1 = require("./talentSeeker.service");
exports.TalentSeekerController = {
    // Create or Update Profile
    createOrUpdateProfile: (0, utils_1.asyncHandler)(async (req, res) => {
        const response = await talentSeeker_service_1.TalentSeekerService.createOrUpdateProfile(req.user._id.toString(), req.body, req.file // Resume file from multer
        );
        return res.status(response.status).json(response);
    }),
    // Get My Profile
    getMyProfile: (0, utils_1.asyncHandler)(async (req, res) => {
        const response = await talentSeeker_service_1.TalentSeekerService.getMyProfile(req.user._id.toString());
        return res.status(response.status).json(response);
    }),
    // Get Profile by ID (public)
    getProfileById: (0, utils_1.asyncHandler)(async (req, res) => {
        const response = await talentSeeker_service_1.TalentSeekerService.getProfileById(req.params.id);
        return res.status(response.status).json(response);
    }),
    // Delete Profile
    deleteProfile: (0, utils_1.asyncHandler)(async (req, res) => {
        const response = await talentSeeker_service_1.TalentSeekerService.deleteProfile(req.user._id.toString());
        return res.status(response.status).json(response);
    }),
    // Search TalentSeekers
    searchTalentSeekers: (0, utils_1.asyncHandler)(async (req, res) => {
        const filters = {
            skills: req.query.skills
                ? req.query.skills.split(",")
                : undefined,
            availability: req.query.availability,
            location: req.query.location,
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
        const response = await talentSeeker_service_1.TalentSeekerService.searchTalentSeekers(filters);
        return res.status(response.status).json(response);
    }),
};
//# sourceMappingURL=talentSeeker.controller.js.map