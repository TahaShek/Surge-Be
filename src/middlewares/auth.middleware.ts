import { config } from "config/env";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { TalentFinderModel, TalentSeekerModel, UserModel } from "models";
import { ApiError, asyncHandler, t } from "utils";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    throw new ApiError(401, t("AUTH.INVALID"));
  }

  let decodedAccessToken: JwtPayload & { _id: string };
  try {
    decodedAccessToken = jwt.verify(
      accessToken,
      config.JWT.accessToken.secret
    ) as JwtPayload & { _id: string };
  } catch (error) {
    throw new ApiError(401, t("AUTH.TOKEN_EXPIRED"));
  }

  const user = await UserModel.findById(decodedAccessToken?._id);
  if (!user) {
    throw new ApiError(404, t("USER.NOT_FOUND"));
  }
  const talentFinder = await TalentFinderModel.findOne({
    userId: user._id,
  }).select("_id");
  if (!talentFinder) {
    throw new ApiError(403, t("AUTH.INVALID"));
  }
  const talentSeeker = await TalentSeekerModel.findOne({
    userId: user._id,
  }).select("_id");
  if (!talentSeeker) {
    throw new ApiError(403, t("AUTH.INVALID"));
  }

  req.talentFinderId = talentFinder._id;
  req.talentSeekerId = talentSeeker._id;
  req.user = user;

  next();
});
