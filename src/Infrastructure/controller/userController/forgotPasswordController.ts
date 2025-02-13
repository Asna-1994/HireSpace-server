import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { ForgotPasswordUseCase } from '../../../Application/usecases/user/forgotPasswordUseCase';

export class ForgotPasswordController {
  constructor(private forgotPasswordUseCase: ForgotPasswordUseCase) {}

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, newPassword } = req.body;
      const updatedUser = await this.forgotPasswordUseCase.execute({
        email,
        newPassword,
      });

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.PASSWORD_UPDATED,
        data: {
          updatedUser,
        },
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }
}
