import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { ResendOtpUseCase } from '../../../Application/usecases/company/resendOtpUsecase';

export class ResendOtpController {
  constructor(private resendOtpUseCase: ResendOtpUseCase) {}

  async resendOtp(req: Request, res: Response, next: NextFunction) {
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
