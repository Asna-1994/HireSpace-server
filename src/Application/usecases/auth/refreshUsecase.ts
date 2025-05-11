import { verifyRefreshToken,  generateRefreshToken, generateAccessToken } from '../../../shared/utils/tokenUtils';
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { UserRepository } from '../../../Domain/repository/repo/userRepository';
import { CompanyRepository } from '../../../Domain/repository/repo/companyRepository';

export class RefreshUseCase {
  constructor(
    private userRepository: UserRepository,
    private companyRepository: CompanyRepository
  ) {}

  async execute(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken); 

    if (!payload || !payload.email || !payload.entity) {
      throw new CustomError(STATUS_CODES.UNAUTHORIZED, MESSAGES.INVALID_TOKEN);
    }

    let entity: any;
    if (payload.entity === 'user') {
      entity = await this.userRepository.findByEmail(payload.email);
    } else if (payload.entity === 'company') {
      entity = await this.companyRepository.findByEmail(payload.email);
    } else {
      throw new CustomError(STATUS_CODES.UNAUTHORIZED, MESSAGES.UNKNOWN_ENTITY);
    }

    if (!entity) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
    }

  
    if (entity.isBlocked) {
      throw new CustomError(STATUS_CODES.FORBIDDEN, MESSAGES.BLOCKED);
    }

let token, newRefreshToken;

    if (payload.entity === 'company') {
        token =generateAccessToken({
            id: entity._id,
            email: entity.email,
            role: 'companyAdmin',
            entity: payload.entity,
          });
      
          newRefreshToken = generateRefreshToken({
              id: entity._id,
              email: entity.email,
              role: 'companyAdmin',
              entity: payload.entity,
          });


        await this.companyRepository.saveRefreshToken(entity._id, newRefreshToken);
        await this.companyRepository.removeRefreshToken(entity._id, refreshToken);
      } else {

        token =generateAccessToken({
            id: entity._id,
            email: entity.email,
            role: entity.userRole,
            entity: payload.entity,
          });
      
         newRefreshToken = generateRefreshToken({
              id: entity._id,
              email: entity.email,
              role: entity.userRole,
              entity: payload.entity,
          });
        await this.userRepository.saveRefreshToken(entity._id, newRefreshToken);
        await this.userRepository.removeRefreshToken(entity._id, refreshToken);
      }
      

    return { token, newRefreshToken };
  }
}
