import { Request, Response, NextFunction } from 'express';
import { UserLoginUseCase } from '../../../Application2/usecases/user-auth/UserLoginUsecase';
import { UserSignupUseCase } from '../../../Application2/usecases/user-auth/UserSignupUsecase';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { CustomError } from '../../../shared/error/customError';
import { ForgotPasswordUseCase } from '../../../Application2/usecases/user-auth/forgotPasswordUseCase';
import { VerifyOtpUseCase } from '../../../Application2/usecases/user-auth/otpVerificationUseCase';
import { ResendOtpUseCase } from '../../../Application2/usecases/user-auth/resendOTPUseCase';
import { GoogleSignInUseCase } from '../../../Application2/usecases/user-auth/googleSiginUseCase';


export class UserAuthController {
  constructor(
    private loginUseCase: UserLoginUseCase,
    private signupUseCase: UserSignupUseCase,
    private forgotPasswordUseCase : ForgotPasswordUseCase,
    private verifyOtpUseCase : VerifyOtpUseCase,
    private resendOtpUseCase : ResendOtpUseCase,
    private googleSigninUseCase : GoogleSignInUseCase

  ) {}

   login = async   (req: Request, res: Response, next: NextFunction)  => {
    try {
      const { email, password } = req.body;
      const { token, refreshToken, user } = await this.loginUseCase.execute({
        email,
        password,
      });

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
          user,
          token,
        },
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }


   signup = async  (req: Request, res: Response, next: NextFunction) => {
      try {
        const {
          userName,
          email,
          dateOfBirth,
          phone,
          address,
          userRole,
          password,
        } = req.body;
  
        if (
          !userName ||
          !email ||
          !dateOfBirth ||
          !phone ||
          !address ||
          !password ||
          !userRole
        ) {
          throw new CustomError(
            STATUS_CODES.BAD_REQUEST,
            'Please Provide all the details'
          );
        }
  
        const newTempUser = await this.signupUseCase.execute({
          userName,
          email,
          dateOfBirth,
          phone,
          address,
          userRole,
          password,
        });
  
        console.log('temporary user created', newTempUser);
        console.log('singup ended');
        res.status(STATUS_CODES.SUCCESS).json({
          success: true,
          message: MESSAGES.OTP_SENT,
          data: { user: newTempUser },
        });
      } catch (error) {
        next(error);
      }
    }


  changePassword = async  (req: Request, res: Response, next: NextFunction)  => {
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


 verifyOtp = async  (req: Request, res: Response, next: NextFunction)  => {
    try {
      const { email, otp } = req.body;
      const newUser = await this.verifyOtpUseCase.execute(email, otp);

      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: MESSAGES.SIGNUP_SUCCESS,
        data: {
          user: newUser,
        },
      });
    } catch (error) {
      next(error);
    }
  }


    async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const existingTempUser = await this.resendOtpUseCase.execute(email);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.OTP_SENT,
        data: { user: existingTempUser },
      });
    } catch (error) {
      next(error);
    }
  }


 googleSignIn = async (req: Request, res: Response, next: NextFunction)  => {
    try {
      const { credential } = req.body;
      const { user, token, refreshToken } =
        await this.googleSigninUseCase.execute(credential);

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