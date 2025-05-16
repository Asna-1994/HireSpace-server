import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { CustomError } from '../../../shared/error/customError';
import { CertificateUseCase } from '../../../Application2/usecases/user/CertificatesUseCase';

export class CertificatesController {
  constructor(private certificatesUseCase: CertificateUseCase) {}



  //add certificates
   addOrEditCertificates  = async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        certificateTitle,
        description,
        issuer,
        issuedDate,
        certificateUrl,
      } = req.body;
      const { userId } = req.params;
      const certificateId =
        typeof req.query.certificateId === 'string'
          ? req.query.certificateId
          : undefined;

      if (!certificateTitle || !issuer || !issuedDate) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please fill Necessary fields'
        );
      }
      if (!userId) {
        throw new CustomError(STATUS_CODES.BAD_REQUEST, 'No User Id provided');
      }

      const certificateData = {
        certificateTitle,
        description,
        issuer,
        issuedDate,
        certificateUrl,
        certificateId,
        userId,
      };

      const updatedCertificate =
        await this.certificatesUseCase.addCertificates(certificateData);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: 'certificate added successfully',
        data: {
          certificate: updatedCertificate,
        },
      });
    } catch (error) {
      console.error('Error in adding certificate:', error);
      next(error);
    }
  }

  //get certificates
   getAllCertificates = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please Provide the userId'
        );
      }

      const allCertificates =
        await this.certificatesUseCase.getAllCertificates(userId);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        data: {
          certificates: allCertificates,
        },
      });
    } catch (error) {
      console.error('Error in getting certificates', error);
      next(error);
    }
  }

  //delete certificates
 deleteCertificate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>  => {
    try {
      const { userId, certificateId } = req.params;
      if (!userId || !certificateId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please Provide the required parameters'
        );
      }

      const updatedCertificate =
        await this.certificatesUseCase.deleteCertificateById(
          userId,
          certificateId
        );

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.UPDATED,
        data: {
          certificates: updatedCertificate,
        },
      });
    } catch (error) {
      console.error('Error in deleting certificate', error);
      next(error);
    }
  }

  
}
