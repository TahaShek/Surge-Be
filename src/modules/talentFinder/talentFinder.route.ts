import { Router } from "express";
import { verifyJWT } from "middlewares/auth.middleware";
import { validateResource } from "utils";
import { TalentFinderValidator } from "./talentFinder.validator";
import { TalentFinderController } from "./talentFinder.controller";

const router = Router();

// Protected routes (require authentication)
router.post(
  "/profile",
  verifyJWT,
  validateResource(TalentFinderValidator.createTalentFinderSchema),
  TalentFinderController.createOrUpdateProfile
);

router.put(
  "/profile",
  verifyJWT,
  validateResource(TalentFinderValidator.updateTalentFinderSchema),
  TalentFinderController.createOrUpdateProfile
);

router.get("/profile/me", verifyJWT, TalentFinderController.getMyProfile);

router.delete("/profile", verifyJWT, TalentFinderController.deleteProfile);

// Public routes
router.get(
  "/profile/:id",
  validateResource(TalentFinderValidator.getTalentFinderSchema),
  TalentFinderController.getProfileById
);

router.get("/list", TalentFinderController.listTalentFinders);

export default router;
