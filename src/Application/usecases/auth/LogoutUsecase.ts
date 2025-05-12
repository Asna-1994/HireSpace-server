import jwt from 'jsonwebtoken';
import { UserRepository } from '../../../Domain/repository/repo/userRepository';
import { verifyRefreshToken } from '../../../shared/utils/tokenUtils';
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';

export class LogoutUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(refreshToken: string): Promise<void> {
    
    if (!refreshToken) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.REFRESH_TOKEN_REQUIRED);
    }

    try {

      const payload = verifyRefreshToken(refreshToken);

   if(payload){
    await this.userRepository.removeRefreshToken(payload?.id, refreshToken);
    }
   

    } catch (err) {
  
      const decoded: any = jwt.decode(refreshToken);

      if (decoded?.id) {
        await this.userRepository.removeAllRefreshTokens(decoded.id);
      }

      throw new CustomError(STATUS_CODES.UNAUTHORIZED, MESSAGES.INVALID_REFRESH_TOKEN);
    }
  }
}

