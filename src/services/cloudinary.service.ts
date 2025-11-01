import cloudinary from "../config/cloudinary";
import { ApiError } from "utils/ApiError";
import streamifier from "streamifier";

export class CloudinaryService {
  /**
   * Upload a file buffer to Cloudinary
   */
  static async uploadFile(
    fileBuffer: Buffer,
    folder: string,
    resourceType: "image" | "raw" | "auto" = "auto",
    options?: {
      format?: string;
      public_id?: string;
    }
  ): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: resourceType,
            format: options?.format,
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

  /**
   * Upload a resume file to Cloudinary
   */
  static async uploadResume(
    fileBuffer: Buffer,
    userId: string,
    fileName: string
  ): Promise<string> {
    const folder = `resumes/${userId}`;
    return this.uploadFile(fileBuffer, folder, "auto", {
      public_id: fileName.split(".")[0], // Use original filename without extension
    });
  }

  /**
   * Upload an image to Cloudinary
   */
  static async uploadImage(
    fileBuffer: Buffer,
    folder: string,
    fileName?: string
  ): Promise<string> {
    return this.uploadFile(fileBuffer, folder, "image", {
      public_id: fileName,
    });
  }

  /**
   * Delete a file from Cloudinary by URL
   */
  static async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract public_id from URL
      const urlParts = fileUrl.split("/");
      const fileWithExtension = urlParts[urlParts.length - 1];
      const publicId = urlParts
        .slice(urlParts.indexOf("upload") + 2, -1)
        .concat(fileWithExtension.split(".")[0])
        .join("/");

      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Failed to delete file from Cloudinary:", error);
      // Don't throw error, just log it
    }
  }
}
