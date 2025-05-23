
import jwt from 'jsonwebtoken';
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { IAuthService } from '../../../Domain2/services/IUserAuthService';

export class LogoutUseCase {
  constructor(private userRepository: IUserRepository,
   private authService : IAuthService
  ) {}

  async execute(refreshToken: string): Promise<void> {
    
    if (!refreshToken) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.REFRESH_TOKEN_REQUIRED);
    }

    try {

      const payload =await this.authService.verifyRefreshToken(refreshToken) 

   if(payload){
    await this.userRepository.removeRefreshToken(payload?.id, refreshToken);
    }
   

    } catch (err) {
  
      const decoded: any = jwt.decode(refreshToken);

      if (decoded?.id) {
        await this.userRepository.removeAllRefreshTokens(decoded.id);
      }

      throw new CustomError(STATUS_CODES.UNAUTHORIZED, MESSAGES.INVALID_TOKEN);
    }
  }
}

