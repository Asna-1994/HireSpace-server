import { FileUploadResultDTO } from "../../Application2/dto/Shared/FileUpload";

export interface IFileUploadService {
  upload(filePath: string, folder: string): Promise<FileUploadResultDTO>;
  delete(publicId: string): Promise<void>;
}
