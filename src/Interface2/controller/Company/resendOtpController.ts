import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { ResendOtpUseCase } from '../../../Application2/usecases/company-auth/resendOtpUsecase';

export class ResendOtpController {
  constructor(private resendOtpUseCase: ResendOtpUseCase) {}

   resendOtp = async (req: Request, res: Response, next: NextFunction)  => {
    try {
      const { email } = req.body;

      const existingTempCompany = await this.resendOtpUseCase.execute(email);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.OTP_SENT,
        data: { company: existingTempCompany },
      });
    } catch (error) {
      next(error);
    }
  }
}
