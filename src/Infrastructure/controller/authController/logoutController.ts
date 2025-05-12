import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { LogoutUseCase } from '../../../Application/usecases/auth/LogoutUsecase';


export class LogoutController {

  constructor(private logoutUseCase: LogoutUseCase) {}

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;

      await this.logoutUseCase.execute(refreshToken);

      res.clearCookie('token', { path: '/' });
      res.clearCookie('refreshToken', { path: '/api/auth' });

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.LOGOUT_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  }
}
