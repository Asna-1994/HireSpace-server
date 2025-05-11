import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { GoogleSignInUseCase } from '../../../Application/usecases/user/googleSiginUsecase';

export class GoogleSignInController {
  constructor(private googleSignInUseCase: GoogleSignInUseCase) {}

  async googleSignIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { credential } = req.body;
      const { user, token, refreshToken } =
        await this.googleSignInUseCase.execute(credential);

      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3 * 60 * 1000,
        sameSite: 'strict',
        path: '/',  
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        sameSite: 'strict',
         path: '/api/auth/refresh', 
      
      });

      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: MESSAGES.SIGNUP_SUCCESS,
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
