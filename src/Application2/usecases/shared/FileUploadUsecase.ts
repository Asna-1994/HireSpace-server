

import { FileUploadResultDTO } from '../../dto/Shared/FileUpload';
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { IFileUploadService } from '../../../Domain2/services/IFileUploadService';

export class FileUploadUseCase {

  constructor(private fileService: IFileUploadService) {}

  async execute(filePath: string, folder: string): Promise<FileUploadResultDTO> {
    try {
      return await this.fileService.upload(filePath, folder);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'File upload failed');
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await this.fileService.delete(publicId);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'File deletion failed');
    }
  }
}
