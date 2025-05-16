import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { VerifyOtpUseCase } from '../../../Application2/usecases/company-auth/otpVerificationUsecase';

export class VerifyOtpController {
  constructor(private verifyOtpUseCase: VerifyOtpUseCase) {}

 verifyOtp = async (req: Request, res: Response, next: NextFunction) =>  {
    try {
      const { email, otp } = req.body;
      const newCompany = await this.verifyOtpUseCase.execute(email, otp);

      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: MESSAGES.SIGNUP_SUCCESS,
        data: {
          company: newCompany,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
