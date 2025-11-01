import { Router } from "express";
import { verifyJWT } from "middlewares/auth.middleware";
import { validateResource } from "utils";
import { TalentSeekerValidator } from "./talentSeeker.validator";
import { TalentSeekerController } from "./talentSeeker.controller";
import { uploadResume } from "middlewares/upload.middleware";

const router = Router();

// Protected routes (require authentication)
router.post(
  "/profile",
  verifyJWT,
  uploadResume.single("resume"), // Accept resume file upload
  validateResource(TalentSeekerValidator.createTalentSeekerSchema),
  TalentSeekerController.createOrUpdateProfile
);

router.put(
  "/profile",
  verifyJWT,
  uploadResume.single("resume"), // Accept resume file upload
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
