import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { RefreshUseCase } from '../../../Application/usecases/auth/refreshUsecase';
import { CustomError } from '../../../shared/error/customError';

export class RefreshController {
  constructor(private refreshUseCase:RefreshUseCase) {}

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        throw new CustomError(STATUS_CODES.UNAUTHORIZED, MESSAGES.REFRESH_TOKEN_REQUIRED);
      }

      const { token, newRefreshToken } = await this.refreshUseCase.execute(refreshToken)
  

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'strict', 
        path: '/api/auth/refresh',
      });

      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3 * 60 * 1000,
        sameSite: 'strict',
        path: '/',  
      });

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.TOKEN_REFRESHED,
        data: { token },
      });
    } catch (error) {
      next(error);
    }
  }
}
