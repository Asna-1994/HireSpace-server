import { hashPassword } from './../../../shared/utils/passwordUtils';
import { UserRepository } from '../../../Domain/repository/repo/userRepository';
import { CustomError } from '../../../shared/error/customError';

export class ForgotPasswordUseCase {
  constructor(private UserRepository: UserRepository) {}

  async execute(userData: { email: string; newPassword: string }) {
    const { email, newPassword } = userData;

    const existingUser = await this.UserRepository.findByEmail(email);
    if (!existingUser) {
      throw new CustomError(
        400,
        'No User registered with this email, Please signup first'
      );
    }

    if (existingUser.isBlocked) {
      throw new CustomError(
        400,
        'This user has been blocked. Please contact Admin'
      );
    }

    const hashedNewPassword = await hashPassword(newPassword);

    existingUser.password = hashedNewPassword;
    const updatedExistingUser = await this.UserRepository.update(existingUser);

    return updatedExistingUser;
  }
}
