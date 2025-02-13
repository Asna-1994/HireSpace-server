import { NextFunction, Request, Response } from 'express';

import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { CustomError } from '../../../shared/error/customError';
import { SignupUseCase } from '../../../Application/usecases/company/signupUsecase';

export class SignupController {
  constructor(private signUpUseCase: SignupUseCase) {}

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        companyName,
        email,
        establishedDate,
        phone,
        address,
        industry,
        password,
        companyAdminEmail,
      } = req.body;

      if (
        !companyName ||
        !email ||
        !establishedDate ||
        !phone ||
        !address ||
        !password ||
        !industry ||
        !companyAdminEmail
      ) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please Provide all the details'
        );
      }

      const newTempCompany = await this.signUpUseCase.execute({
        companyName,
        email,
        establishedDate,
        phone,
        address,
        industry,
        password,
        companyAdminEmail,
      });

      console.log('temporary user created', newTempCompany);
      console.log('singup ended');
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.OTP_SENT,
        data: { company: newTempCompany },
      });
    } catch (error) {
      next(error);
    }
  }
}
