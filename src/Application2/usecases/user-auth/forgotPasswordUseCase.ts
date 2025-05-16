import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { IAuthService } from '../../../Domain2/services/IUserAuthService';

export class ForgotPasswordUseCase {
  constructor(private UserRepository: IUserRepository,
    private authService : IAuthService
  ) {}

execute = async (userData: { email: string; newPassword: string }) => {
    const { email, newPassword } = userData;

    const existingUser = await this.UserRepository.findByEmail(email);
    if (!existingUser) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
      MESSAGES.PLEASE_SIGNUP
      );
    }

    if (existingUser.isBlocked) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
       MESSAGES.USER_BLOCKED
      );
    }

    const hashedNewPassword = await this.authService.hashPassword(newPassword) 

    existingUser.password = hashedNewPassword;
    const updatedExistingUser = await this.UserRepository.update(existingUser);

    return updatedExistingUser;
  }
}
