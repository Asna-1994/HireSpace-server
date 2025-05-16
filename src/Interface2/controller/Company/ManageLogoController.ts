import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';

import { HandleFileUploadUseCase } from '../../../Application2/usecases/company/HandleFile';
import { HandleFileDTO } from '../../../Application2/dto/Company/CompanyProfileDTO';
import { ManageLogoUseCase } from '../../../Application2/usecases/company/ManageLogoUseCase';

export class ManageLogoController {
  constructor(

    private handleFileUseCase : HandleFileUploadUseCase,
    private manageLogoUseCase : ManageLogoUseCase
  ) {}

uploadLogo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> =>  {
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

      const uploadInput : HandleFileDTO={
        filePath : req.file.path,
        companyId,
          folder :'company_logo',
               fieldToUpdate: 'companyLogo'

        
      }

      const updatedCompany = await this.handleFileUseCase.execute(uploadInput);
      
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

deleteLogo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const companyId = req.params.companyId;
      if (!companyId) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.AUTH_TOKEN_MISSING });
        return;
      }

      const updatedCompany =await this.manageLogoUseCase.deleteLogo(companyId)
console.log('updated company', updatedCompany)
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
