import { Application } from "express";
import { IUser } from "./@types/models/user.types";
import { Types } from "mongoose";
declare global {
    namespace Express {
        interface Request {
            user: IUser;
            talentFinderId: Types.ObjectId | string;
            talentSeekerId: Types.ObjectId | string;
        }
    }
}
declare const app: Application;
export default app;
//# sourceMappingURL=app.d.ts.map