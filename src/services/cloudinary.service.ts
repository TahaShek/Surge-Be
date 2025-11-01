import cloudinary from "../config/cloudinary";
import { ApiError } from "utils/ApiError";
import streamifier from "streamifier";

export class CloudinaryService {
  static async uploadFile(
    fileBuffer: Buffer,
    folder: string,
    resourceType: "image" | "raw" | "auto" = "auto",
    options?: {
      public_id?: string;
    }
  ): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: resourceType,
            public_id: options?.public_id,
          },
          (error, result) => {
            if (error) {
              reject(
                new ApiError(500, `Cloudinary upload failed: ${error.message}`)
              );
            } else {
              resolve(result!.secure_url);
            }
          }
        );

        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
      });
    } catch (error) {
      throw new ApiError(500, "Failed to upload file to Cloudinary");
    }
  }

  static async uploadResume(
    fileBuffer: Buffer,
    userId: string,
    fileName: string
  ): Promise<string> {
    const folder = `resumes/${userId}`;
    return this.uploadFile(fileBuffer, folder, "raw", {
      public_id: fileName.replace(/\.[^/.]+$/, ""),
    });
  }

  static async uploadImage(
    fileBuffer: Buffer,
    folder: string,
    fileName?: string
  ): Promise<string> {
    return this.uploadFile(fileBuffer, folder, "image", {
      public_id: fileName,
    });
  }

  static async deleteFile(fileUrl: string): Promise<void> {
    try {
      const urlParts = fileUrl.split("/");
      const fileWithExtension = urlParts[urlParts.length - 1];
      const publicId = urlParts
        .slice(urlParts.indexOf("upload") + 2, -1)
        .concat(fileWithExtension.split(".")[0])
        .join("/");
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Failed to delete file from Cloudinary:", error);
    }
  }
}
