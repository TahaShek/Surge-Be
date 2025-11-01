import { Router } from "express";

import AuthRouter from "../modules/auth/auth.route";
import NotificationRouter from "../modules/notifications/notification.route";
import TalentSeekerRouter from "../modules/talentSeeker/talentSeeker.route";
import TalentFinderRouter from "../modules/talentFinder/talentFinder.route";
import JobRouter from "../modules/job/job.route";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/notifications", NotificationRouter);
router.use("/talent-seeker", TalentSeekerRouter);
router.use("/talent-finder", TalentFinderRouter);
router.use("/job", JobRouter);

export default router;
