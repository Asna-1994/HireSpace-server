import {
  cloudinary,
  uploadToCloudinary,
} from "../../../Infrastructure/config/cloudinaryConfig";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";
import { CustomError } from "../../../shared/error/customError";

export interface FileUploadResult {
  url: string;
  publicId: string;
}

export class FileUploadUseCase {
  constructor() {}

  async execute(filePath: string, folder: string): Promise<FileUploadResult> {
    try {
      const result = await uploadToCloudinary(filePath, folder);
      console.log(result);
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      console.error("Error in FileUploadUseCase:", error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        "File upload failed"
      );
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);

      if (result.result === "ok") {
        console.log("File deleted successfully from Cloudinary");
      } else {
        console.error("Error deleting file from Cloudinary:", result);
        throw new CustomError(
          STATUS_CODES.INTERNAL_SERVER_ERROR,
          "Failed to delete file"
        );
      }
    } catch (error) {
      console.error("Error in deleteFile:", error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        "Error deleting file from Cloudinary"
      );
    }
  }
}
