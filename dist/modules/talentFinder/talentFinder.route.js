"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const utils_1 = require("../../utils");
const talentFinder_validator_1 = require("./talentFinder.validator");
const talentFinder_controller_1 = require("./talentFinder.controller");
const router = (0, express_1.Router)();
// Protected routes (require authentication)
router.post("/profile", auth_middleware_1.verifyJWT, (0, utils_1.validateResource)(talentFinder_validator_1.TalentFinderValidator.createTalentFinderSchema), talentFinder_controller_1.TalentFinderController.createOrUpdateProfile);
router.put("/profile", auth_middleware_1.verifyJWT, (0, utils_1.validateResource)(talentFinder_validator_1.TalentFinderValidator.updateTalentFinderSchema), talentFinder_controller_1.TalentFinderController.createOrUpdateProfile);
router.get("/profile/me", auth_middleware_1.verifyJWT, talentFinder_controller_1.TalentFinderController.getMyProfile);
router.delete("/profile", auth_middleware_1.verifyJWT, talentFinder_controller_1.TalentFinderController.deleteProfile);
// Public routes
router.get("/profile/:id", (0, utils_1.validateResource)(talentFinder_validator_1.TalentFinderValidator.getTalentFinderSchema), talentFinder_controller_1.TalentFinderController.getProfileById);
router.get("/list", talentFinder_controller_1.TalentFinderController.listTalentFinders);
exports.default = router;
//# sourceMappingURL=talentFinder.route.js.map