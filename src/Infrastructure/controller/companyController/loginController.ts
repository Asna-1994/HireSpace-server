import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { LoginUseCase } from '../../../Application/usecases/company/loginUseCase';


export class LoginController {
  constructor(private loginUseCase: LoginUseCase) {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      
     const { token, company, user } = await this.loginUseCase.execute({ email, password });
      if(!company){

      }


      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'strict',
      });

      res.status(STATUS_CODES.SUCCESS).json({
        success : true,
        message: MESSAGES.LOGIN_SUCCESS,
        data: {
          company : company,
          token : token,
          user : user || null
        },
      });
    } catch (error) {
      next(error);
      console.log(error)
    }
  }
}
