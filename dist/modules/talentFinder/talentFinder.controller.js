"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TalentFinderController = void 0;
const utils_1 = require("../../utils");
const talentFinder_service_1 = require("./talentFinder.service");
exports.TalentFinderController = {
    // Create Profile
    createProfile: (0, utils_1.asyncHandler)(async (req, res) => {
        const response = await talentFinder_service_1.TalentFinderService.createProfile(req.user._id.toString(), req.body);
        return res.status(response.status).json(response);
    }),
    // Update Profile
    updateProfile: (0, utils_1.asyncHandler)(async (req, res) => {
        const response = await talentFinder_service_1.TalentFinderService.updateProfile(req.user._id.toString(), req.body);
        return res.status(response.status).json(response);
    }),
    // Create or Update Profile
    createOrUpdateProfile: (0, utils_1.asyncHandler)(async (req, res) => {
        const response = await talentFinder_service_1.TalentFinderService.createOrUpdateProfile(req.user._id.toString(), req.body);
        return res.status(response.status).json(response);
    }),
    // Get My Profile
    getMyProfile: (0, utils_1.asyncHandler)(async (req, res) => {
        const response = await talentFinder_service_1.TalentFinderService.getMyProfile(req.user._id.toString());
        return res.status(response.status).json(response);
    }),
    // Get Profile by ID (public)
    getProfileById: (0, utils_1.asyncHandler)(async (req, res) => {
        const response = await talentFinder_service_1.TalentFinderService.getProfileById(req.params.id);
        return res.status(response.status).json(response);
    }),
    // Delete Profile
    deleteProfile: (0, utils_1.asyncHandler)(async (req, res) => {
        const response = await talentFinder_service_1.TalentFinderService.deleteProfile(req.user._id.toString());
        return res.status(response.status).json(response);
    }),
    // List TalentFinders
    listTalentFinders: (0, utils_1.asyncHandler)(async (req, res) => {
        const filters = {
            industry: req.query.industry,
            location: req.query.location,
            companySize: req.query.companySize,
            isVerifiedCompany: req.query.isVerifiedCompany === "true",
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 10,
        };
        const response = await talentFinder_service_1.TalentFinderService.listTalentFinders(filters);
        return res.status(response.status).json(response);
    }),
};
//# sourceMappingURL=talentFinder.controller.js.map