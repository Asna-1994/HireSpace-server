import { hashPassword } from './../../../shared/utils/passwordUtils';
import { UserRepository } from '../../../Domain/repository/repo/userRepository';
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';

export class ForgotPasswordUseCase {
  constructor(private UserRepository: UserRepository) {}

  async execute(userData: { email: string; newPassword: string }) {
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

    const hashedNewPassword = await hashPassword(newPassword);

    existingUser.password = hashedNewPassword;
    const updatedExistingUser = await this.UserRepository.update(existingUser);

    return updatedExistingUser;
  }
}
