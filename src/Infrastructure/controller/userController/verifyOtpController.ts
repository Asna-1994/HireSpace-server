import { NextFunction, Request, Response } from "express";
import { VerifyOtpUseCase } from "../../../Application/usecases/user/otpVerificationUsecase";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";
import { MESSAGES } from "../../../shared/constants/messages";

export class VerifyOtpController {
  constructor(private verifyOtpUseCase: VerifyOtpUseCase) {}

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      const newUser = await this.verifyOtpUseCase.execute(email, otp);

      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: MESSAGES.SIGNUP_SUCCESS,
        data: {
          user: newUser,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
