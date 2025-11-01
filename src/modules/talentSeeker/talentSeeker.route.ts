import { Router } from "express";
import { verifyJWT } from "middlewares/auth.middleware";
import { validateResource } from "utils";
import { TalentSeekerValidator } from "./talentSeeker.validator";
import { TalentSeekerController } from "./talentSeeker.controller";

const router = Router();

// Protected routes (require authentication)
router.post(
  "/profile",
  verifyJWT,
  validateResource(TalentSeekerValidator.createTalentSeekerSchema),
  TalentSeekerController.createOrUpdateProfile
);

router.put(
  "/profile",
  verifyJWT,
  validateResource(TalentSeekerValidator.updateTalentSeekerSchema),
  TalentSeekerController.createOrUpdateProfile
);

router.get("/profile/me", verifyJWT, TalentSeekerController.getMyProfile);

router.delete("/profile", verifyJWT, TalentSeekerController.deleteProfile);

// Public routes
router.get(
  "/profile/:id",
  validateResource(TalentSeekerValidator.getTalentSeekerSchema),
  TalentSeekerController.getProfileById
);

router.get("/search", TalentSeekerController.searchTalentSeekers);

export default router;
