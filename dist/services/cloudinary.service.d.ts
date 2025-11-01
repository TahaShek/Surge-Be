export declare class CloudinaryService {
    static uploadFile(fileBuffer: Buffer, folder: string, resourceType?: "image" | "raw" | "auto", options?: {
        public_id?: string;
    }): Promise<string>;
    static uploadResume(fileBuffer: Buffer, userId: string, fileName: string): Promise<string>;
    static uploadImage(fileBuffer: Buffer, folder: string, fileName?: string): Promise<string>;
    static deleteFile(fileUrl: string): Promise<void>;
}
//# sourceMappingURL=cloudinary.service.d.ts.map