"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const utils_1 = require("../../utils");
const talentSeeker_validator_1 = require("./talentSeeker.validator");
const talentSeeker_controller_1 = require("./talentSeeker.controller");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const router = (0, express_1.Router)();
// Protected routes (require authentication)
router.post("/profile", auth_middleware_1.verifyJWT, upload_middleware_1.uploadResume.single("resume"), // Accept resume file upload
(0, utils_1.validateResource)(talentSeeker_validator_1.TalentSeekerValidator.createTalentSeekerSchema), talentSeeker_controller_1.TalentSeekerController.createOrUpdateProfile);
router.put("/profile", auth_middleware_1.verifyJWT, upload_middleware_1.uploadResume.single("resume"), // Accept resume file upload
(0, utils_1.validateResource)(talentSeeker_validator_1.TalentSeekerValidator.updateTalentSeekerSchema), talentSeeker_controller_1.TalentSeekerController.createOrUpdateProfile);
router.get("/profile/me", auth_middleware_1.verifyJWT, talentSeeker_controller_1.TalentSeekerController.getMyProfile);
router.delete("/profile", auth_middleware_1.verifyJWT, talentSeeker_controller_1.TalentSeekerController.deleteProfile);
// Public routes
router.get("/profile/:id", (0, utils_1.validateResource)(talentSeeker_validator_1.TalentSeekerValidator.getTalentSeekerSchema), talentSeeker_controller_1.TalentSeekerController.getProfileById);
router.get("/search", talentSeeker_controller_1.TalentSeekerController.searchTalentSeekers);
exports.default = router;
//# sourceMappingURL=talentSeeker.route.js.map