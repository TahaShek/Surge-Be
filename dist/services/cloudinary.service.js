"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const ApiError_1 = require("../utils/ApiError");
const streamifier_1 = __importDefault(require("streamifier"));
class CloudinaryService {
    static async uploadFile(fileBuffer, folder, resourceType = "auto", options) {
        try {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({
                    folder,
                    resource_type: resourceType,
                    public_id: options?.public_id,
                }, (error, result) => {
                    if (error) {
                        reject(new ApiError_1.ApiError(500, `Cloudinary upload failed: ${error.message}`));
                    }
                    else {
                        resolve(result.secure_url);
                    }
                });
                streamifier_1.default.createReadStream(fileBuffer).pipe(uploadStream);
            });
        }
        catch (error) {
            throw new ApiError_1.ApiError(500, "Failed to upload file to Cloudinary");
        }
    }
    static async uploadResume(fileBuffer, userId, fileName) {
        const folder = `resumes/${userId}`;
        return this.uploadFile(fileBuffer, folder, "raw", {
            public_id: fileName.replace(/\.[^/.]+$/, ""),
        });
    }
    static async uploadImage(fileBuffer, folder, fileName) {
        return this.uploadFile(fileBuffer, folder, "image", {
            public_id: fileName,
        });
    }
    static async deleteFile(fileUrl) {
        try {
            const urlParts = fileUrl.split("/");
            const fileWithExtension = urlParts[urlParts.length - 1];
            const publicId = urlParts
                .slice(urlParts.indexOf("upload") + 2, -1)
                .concat(fileWithExtension.split(".")[0])
                .join("/");
            await cloudinary_1.default.uploader.destroy(publicId);
        }
        catch (error) {
            console.error("Failed to delete file from Cloudinary:", error);
        }
    }
}
exports.CloudinaryService = CloudinaryService;
//# sourceMappingURL=cloudinary.service.js.map