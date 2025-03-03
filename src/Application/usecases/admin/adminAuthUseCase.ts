import { UserRepository } from '../../../Domain/repository/repo/userRepository';
import { CustomError } from '../../../shared/error/customError';
import { generateToken } from '../../../shared/utils/tokenUtils';
import { comparePassword } from '../../../shared/utils/passwordUtils';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';

export class AdminAuthUseCase {
  constructor(private UserRepository: UserRepository) {}

  async login(adminData: { email: string; password: string }) {
    const { email, password } = adminData;

    const existingUser = await this.UserRepository.findByEmail(email);
    if (!existingUser) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
    }

    if (existingUser.isBlocked) {
      throw new CustomError(STATUS_CODES.FORBIDDEN, MESSAGES.BLOCKED);
    }

    const isPasswordValid = await comparePassword(
      password,
      existingUser.password as string
    );

    if (!isPasswordValid) {
      throw new CustomError(
        STATUS_CODES.UNAUTHORIZED,
        MESSAGES.INVALID_PASSWORD
      );
    }

    if (existingUser.userRole !== 'admin') {
      throw new CustomError(STATUS_CODES.FORBIDDEN, 'Only admin can login');
    }

    const token = generateToken({
      id: existingUser._id,
      email: existingUser.email,
      role: existingUser.userRole,
      entity: 'user',
    });

    return { token, user: existingUser };
  }
}
