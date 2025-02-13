import { NextFunction, Request, Response } from 'express';
import { SignupUseCase } from '../../../Application/usecases/user/signupUsecase';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { CustomError } from '../../../shared/error/customError';

export class SignupController {
  constructor(private signupUseCase: SignupUseCase) {}

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        userName,
        email,
        dateOfBirth,
        phone,
        address,
        userRole,
        password,
      } = req.body;

      if (
        !userName ||
        !email ||
        !dateOfBirth ||
        !phone ||
        !address ||
        !password ||
        !userRole
      ) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please Provide all the details'
        );
      }

      const newTempUser = await this.signupUseCase.execute({
        userName,
        email,
        dateOfBirth,
        phone,
        address,
        userRole,
        password,
      });

      console.log('temporary user created', newTempUser);
      console.log('singup ended');
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.OTP_SENT,
        data: { user: newTempUser },
      });
    } catch (error) {
      next(error);
    }
  }
}
