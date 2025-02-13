import { Request, Response, NextFunction } from 'express';
import { FileUploadUseCase } from '../../../Application/usecases/shared/fileUploadUsecase';
import { UserRepository } from '../../../Domain/repository/repo/userRepository';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { CompanyRepository } from '../../../Domain/repository/repo/companyRepository';
import { handleFileUploadAndUpdate } from '../../../Application/service/company/fileUploadService';

export class UploadLogoController {
  constructor(
    private fileUploadUseCase: FileUploadUseCase,
    private companyRepository: CompanyRepository
  ) {}

  async uploadLogo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log(req.file);
      console.log(req.body);
      if (!req.file) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.NO_UPLOAD });
        return;
      }
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.INVALID_FILE_TYPE_PDF });
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
        'company_logo',
        'companyLogo'
      );
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.SUCCESSFULLY_UPLOADED,
        data: { company: updatedCompany },
      });
    } catch (error) {
      console.error('Error in uploadProfilePicture:', error);
      next(error);
    }
  }

  //deleting logo
  async deleteLogo(
    req: Request,
    res: Response,
    next: NextFunction
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
      if (!company || !company.companyLogo) {
        res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ success: false, message: MESSAGES.COMPANY_NOT_FOUND });
        return;
      }

      const { publicId } = company.companyLogo;
      if (!publicId) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: 'No logo to delete' });
        return;
      }

      await this.fileUploadUseCase.deleteFile(publicId);

      company.companyLogo = {
        url: '',
        publicId: '',
      };
      const updatedCompany = await this.companyRepository.update(company);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.SUCCESSFULLY_DELETED,
        data: { company: updatedCompany },
      });
    } catch (error) {
      console.error('Error in deleteLogo:', error);
      next(error);
    }
  }
}
