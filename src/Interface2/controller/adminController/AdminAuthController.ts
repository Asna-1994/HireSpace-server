import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { AdminAuthUseCase } from '../../../Application2/usecases/admin/AdminAuthUseCase';


export class AdminAuthController {
  constructor(private adminAuthUseCase: AdminAuthUseCase) {}

 login = async (req: Request, res: Response, next: NextFunction)  => {
    try {
      const { email, password } = req.body;
      const { token, user, refreshToken } = await this.adminAuthUseCase.login({
        email,
        password,
      });

      res.cookie('authToken', token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
            secure : true,
        maxAge: 10 * 60 * 1000,
            sameSite: 'none',
        path: '/',  
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
            secure : true,
        maxAge: 7 * 24 * 60 * 60 * 1000, 
                    sameSite: 'none',
         path: '/api/auth', 
      
      });

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.LOGIN_SUCCESS,
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


