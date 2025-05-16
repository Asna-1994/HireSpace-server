import { FileUploadResultDTO } from "../../Application2/dto/Shared/FileUpload";
import { IFileUploadService } from "../../Domain2/services/IFileUploadService";
import { MESSAGES } from "../../shared/constants/messages";
import { STATUS_CODES } from "../../shared/constants/statusCodes";
import { CustomError } from "../../shared/error/customError";
import { uploadToCloudinary,  cloudinary, } from "../config/cloudinaryConfig";


export class FileUploadService implements IFileUploadService {
  async upload(filePath: string, folder: string): Promise<FileUploadResultDTO> {
    try {
      const result = await uploadToCloudinary(filePath, folder);
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      console.error('Error in FileUploadService.upload:', error);
      throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'File upload failed');
    }
  }

  async delete(publicId: string): Promise<void> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result !== 'ok') {
        throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, MESSAGES.FAILED_DELETE_FILE);
      }
    } catch (error) {
      console.error('Error in FileUploadService.delete:', error);
      throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'File delete failed');
    }
  }
}
