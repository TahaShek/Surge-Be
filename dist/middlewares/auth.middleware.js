"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const env_1 = require("../config/env");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const utils_1 = require("../utils");
exports.verifyJWT = (0, utils_1.asyncHandler)(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) {
        throw new utils_1.ApiError(401, (0, utils_1.t)("AUTH.INVALID"));
    }
    let decodedAccessToken;
    try {
        decodedAccessToken = jsonwebtoken_1.default.verify(accessToken, env_1.config.JWT.accessToken.secret);
    }
    catch (error) {
        throw new utils_1.ApiError(401, (0, utils_1.t)("AUTH.TOKEN_EXPIRED"));
    }
    const user = await models_1.UserModel.findById(decodedAccessToken?._id);
    if (!user) {
        throw new utils_1.ApiError(404, (0, utils_1.t)("USER.NOT_FOUND"));
    }
    const talentFinder = await models_1.TalentFinderModel.findOne({
        userId: user._id,
    }).select("_id");
    if (!talentFinder) {
        throw new utils_1.ApiError(403, (0, utils_1.t)("AUTH.INVALID"));
    }
    const talentSeeker = await models_1.TalentSeekerModel.findOne({
        userId: user._id,
    }).select("_id");
    if (!talentSeeker) {
        throw new utils_1.ApiError(403, (0, utils_1.t)("AUTH.INVALID"));
    }
    req.talentFinderId = talentFinder._id;
    req.talentSeekerId = talentSeeker._id;
    req.user = user;
    next();
});
//# sourceMappingURL=auth.middleware.js.map