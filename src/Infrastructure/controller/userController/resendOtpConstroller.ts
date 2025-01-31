import { NextFunction, Request, Response } from "express";
import { SignupUseCase } from "../../../Application/usecases/user/signupUsecase";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";
import { MESSAGES } from "../../../shared/constants/messages";
import { ResendOtpUseCase } from "../../../Application/usecases/user/resendOtpUsecase";

export class ResendOtpController {
  constructor(private resendOtpUseCase: ResendOtpUseCase) {}

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const existingTempUser = await this.resendOtpUseCase.execute(email);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.OTP_SENT,
        data: { user: existingTempUser },
      });
    } catch (error) {
      next(error);
    }
  }
}
