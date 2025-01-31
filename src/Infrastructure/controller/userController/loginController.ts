import { Request, Response, NextFunction } from 'express';
import { LoginUseCase } from '../../../Application/usecases/user/loginUsecase';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';


export class LoginController {
  constructor(private loginUseCase: LoginUseCase) {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { token, user, jobSeekerProfile } = await this.loginUseCase.execute({ email, password });


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
          user,
          token,
          jobSeekerProfile
        },
      });
    } catch (error) {
      next(error);
      console.log(error)
    }
  }
}
