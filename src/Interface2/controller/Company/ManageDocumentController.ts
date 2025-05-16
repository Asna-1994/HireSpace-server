import { ManageDocumentUseCase } from './../../../Application2/usecases/company/ManageDocumentUseCase';
import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { HandleFileUploadUseCase } from '../../../Application2/usecases/company/HandleFile';
import { HandleFileDTO } from '../../../Application2/dto/Company/CompanyProfileDTO';
import { CustomError } from '../../../shared/error/customError';


export class ManageDocumentController {
  constructor(

    private handleFileUseCase : HandleFileUploadUseCase,
    private manageDocumentUseCase : ManageDocumentUseCase
  ) {}

 uploadDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log(req.file);
      console.log(req.body);
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
                'Missing document number field'
              );
            }
      const allowedMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg', 'image/png', 'image/jpg'
      ];
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
          folder : 'verification_document',
               fieldToUpdate: 'verificationDocument',
               documentNumber

        
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

 deleteDocument = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>  => {
    try {
      const companyId = req.params.companyId;
      if (!companyId) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.AUTH_TOKEN_MISSING });
        return;
      }

      const updatedCompany =await this.manageDocumentUseCase.deleteDocument(companyId)

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
