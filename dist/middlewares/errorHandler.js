"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const logger_1 = __importDefault(require("../config/logger"));
const ErrorMiddleware = (err, req, res, next) => {
    logger_1.default.error(err);
    if (err instanceof ApiError_1.ApiError) {
        return res
            .status(err.status)
            .json(new ApiResponse_1.ApiResponse(err.status, err.message, null, false));
    }
    return res
        .status(500)
        .json(new ApiResponse_1.ApiResponse(500, "Something went wrong", null, false));
};
exports.ErrorMiddleware = ErrorMiddleware;
//# sourceMappingURL=errorHandler.js.map