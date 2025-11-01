"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const env_1 = require("./env");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: env_1.config.CLOUDINARY.cloud_name,
    api_key: env_1.config.CLOUDINARY.api_key,
    api_secret: env_1.config.CLOUDINARY.api_secret,
});
exports.default = cloudinary_1.v2;
//# sourceMappingURL=cloudinary.js.map