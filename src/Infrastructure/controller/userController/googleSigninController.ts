import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { GoogleSignInUseCase } from '../../../Application/usecases/user/googleSiginUsecase';



export class GoogleSignInController {
  constructor(private googleSignInUseCase:GoogleSignInUseCase) {}

  async googleSignIn(req: Request, res: Response, next : NextFunction) {
    try {
            const { credential } = req.body;
            const{user,token, jobSeekerProfile} = await this.googleSignInUseCase.execute(credential);
            res.status(STATUS_CODES.CREATED).json({
              success: true,
              message: MESSAGES.SIGNUP_SUCCESS,
              data: {
                user, token,jobSeekerProfile
              }
            });
          } catch (error) {
            next(error);
          }
  }
}