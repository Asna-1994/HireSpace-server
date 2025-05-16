import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { LoginRequestDTO } from '../../dto/user-auth/LoginDTO';
import { IAuthService } from '../../../Domain2/services/IUserAuthService';

export class AdminAuthUseCase {
  constructor(private UserRepository:IUserRepository,
    private authService : IAuthService
  ) {}

  async login(adminData: LoginRequestDTO) {
    const { email, password } = adminData;

    const existingUser = await this.UserRepository.findByEmail(email);
    if (!existingUser) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
    }

    if (existingUser.isBlocked) {
      throw new CustomError(STATUS_CODES.FORBIDDEN, MESSAGES.BLOCKED);
    }

    const isPasswordValid = await this.authService.comparePassword(password, existingUser.password as string)
    //  await comparePassword(
    //   password,
    //   existingUser.password as string
    // );

    if (!isPasswordValid) {
      throw new CustomError(
        STATUS_CODES.UNAUTHORIZED,
        MESSAGES.INVALID_PASSWORD
      );
    }

    if (existingUser.userRole !== 'admin') {
      throw new CustomError(STATUS_CODES.FORBIDDEN,MESSAGES.ONLY_ADMIN);
    }

    const token = this.authService.generateAccessToken({
      id: existingUser._id.toString(),
      email: existingUser.email,
      role: existingUser.userRole,
      entity: 'user',
    });
    const refreshToken = this.authService.generateRefreshToken({
      id: existingUser._id.toString(),
      email: existingUser.email,
      role: existingUser.userRole,
      entity: 'user',
    });
    
    await this.UserRepository.saveRefreshToken(existingUser._id.toString(), refreshToken);

    return { token, user: existingUser , refreshToken};
  }
}
