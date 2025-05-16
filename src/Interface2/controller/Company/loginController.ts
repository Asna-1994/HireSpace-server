import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { CompanyLoginUseCase } from '../../../Application2/usecases/company-auth/loginUseCase';


export class LoginController {
  constructor(private loginUseCase: CompanyLoginUseCase) {}

 login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const { token, company, user , refreshToken} = await this.loginUseCase.execute({
        email,
        password,
      });
      if (!company) {
      }

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
         path: '/api/auth', 
      
      });

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.LOGIN_SUCCESS,
        data: {
          company: company,
          token: token,
          user: user || null,
        },
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }
}
