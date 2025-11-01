"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const notification_route_1 = __importDefault(require("../modules/notifications/notification.route"));
const talentSeeker_route_1 = __importDefault(require("../modules/talentSeeker/talentSeeker.route"));
const talentFinder_route_1 = __importDefault(require("../modules/talentFinder/talentFinder.route"));
const job_route_1 = __importDefault(require("../modules/job/job.route"));
const router = (0, express_1.Router)();
router.use("/auth", auth_route_1.default);
router.use("/notifications", notification_route_1.default);
router.use("/talent-seeker", talentSeeker_route_1.default);
router.use("/talent-finder", talentFinder_route_1.default);
router.use("/job", job_route_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map