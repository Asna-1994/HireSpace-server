import { Request, Response, NextFunction } from "express";
import { FileUploadUseCase } from "../../../Application/usecases/shared/fileUploadUsecase";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";
import { MESSAGES } from "../../../shared/constants/messages";
import { CompanyRepository } from "../../../Domain/repository/repo/companyRepository";
import { handleFileUploadAndUpdate } from "../../../Application/service/company/fileUploadService";
import { CustomError } from "../../../shared/error/customError";

export class UploadDocumentController {
  constructor(
    private fileUploadUseCase: FileUploadUseCase,
    private companyRepository: CompanyRepository,
  ) {}

  async uploadDocument(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.file) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.NO_UPLOAD });
        return;
      }
      const { documentNumber } = req.body;
      if (!documentNumber) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          "Missing document number field",
        );
      }

      const allowedMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.INVALID_FILE_TYPE });
        return;
      }

      const companyId = req.params.companyId;
      if (!companyId) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.AUTH_TOKEN_MISSING });
        return;
      }

      const updatedCompany = await handleFileUploadAndUpdate(
        this.fileUploadUseCase,
        this.companyRepository,
        req.file.path,
        companyId,
        "verification_document",
        "verificationDocument",
        documentNumber,
      );

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.SUCCESSFULLY_UPLOADED,
        data: {
          company: updatedCompany,
        },
      });
    } catch (error) {
      console.error("Error in uploadProfilePicture:", error);
      next(error);
    }
  }

  async deleteDocument(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const companyId = req.params.companyId;
      if (!companyId) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.AUTH_TOKEN_MISSING });
        return;
      }

      const company = await this.companyRepository.findById(companyId);
      if (!company || !company.verificationDocument) {
        res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ success: false, message: MESSAGES.COMPANY_NOT_FOUND });
        return;
      }

      const { publicId } = company.verificationDocument;
      if (!publicId) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: "No logo to delete" });
        return;
      }

      await this.fileUploadUseCase.deleteFile(publicId);

      company.verificationDocument = {
        url: "",
        publicId: "",
      };
      const updatedCompany = await this.companyRepository.update(company);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.SUCCESSFULLY_DELETED,
        data: { company: updatedCompany },
      });
    } catch (error) {
      console.error("Error in deleteLogo:", error);
      next(error);
    }
  }
}
