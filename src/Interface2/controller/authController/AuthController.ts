import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';

import { RefreshUseCase } from '../../../Application2/usecases/auth/refreshTokenUseCase';
import { CustomError } from '../../../shared/error/customError';
import { LogoutUseCase } from '../../../Application2/usecases/auth/LogoutUseCase';


export class AuthController {

  constructor(private logoutUseCase: LogoutUseCase,
    private refreshUseCase : RefreshUseCase
  ) {}

  logout = async (req: Request, res: Response, next: NextFunction) =>  {
    try {
      const refreshToken = req.cookies?.refreshToken;

      await this.logoutUseCase.execute(refreshToken);

      res.clearCookie('authToken', { path: '/' });
      res.clearCookie('refreshToken', { path: '/api/auth' });

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.LOGOUT_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  }


   refreshToken = async (req: Request, res: Response, next: NextFunction) =>  {
      try {
        const refreshToken = req.cookies.refreshToken;
  
        if (!refreshToken) {
          throw new CustomError(STATUS_CODES.UNAUTHORIZED, MESSAGES.REFRESH_TOKEN_REQUIRED);
        }
  
        const { token, newRefreshToken } = await this.refreshUseCase.execute(refreshToken)
    


        res.cookie('refreshToken', newRefreshToken, {
          httpOnly: true,
          // secure: process.env.NODE_ENV === 'production',
              secure : true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'none',
          path: '/api/auth',
        });
  
        res.cookie('authToken', token, {
          httpOnly: true,
          // secure: process.env.NODE_ENV === 'production',
              secure : true,
          maxAge: 10 * 60 * 1000,
            sameSite: 'none',
          path: '/',  
        });
  

        res.status(STATUS_CODES.SUCCESS).json({
          success: true,
          message: MESSAGES.TOKEN_REFRESHED,
          token,
        });
      } catch (error) {
        next(error);
      }
    }



}
