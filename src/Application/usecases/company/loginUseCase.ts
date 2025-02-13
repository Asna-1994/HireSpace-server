import { CompanyRepository } from '../../../Domain/repository/repo/companyRepository';
import { CustomError } from '../../../shared/error/customError';
import { generateToken } from '../../../shared/utils/tokenUtils';
import { comparePassword } from '../../../shared/utils/passwordUtils';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { UserRepository } from '../../../Domain/repository/repo/userRepository';
import { User } from '../../../Domain/entities/User';
import { MESSAGES } from '../../../shared/constants/messages';

export class LoginUseCase {
  constructor(
    private companyRepository: CompanyRepository,
    private userRepository: UserRepository
  ) {}

  async execute(loginData: { email: string; password: string }) {
    const { email, password } = loginData;

    if (!email || !password) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
        'Please provide Email and password'
      );
    }

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      if (existingUser.isBlocked) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'This user account has been blocked. Please contact Admin'
        );
      }

      const isUserPasswordValid = await comparePassword(
        password,
        existingUser.password as string
      );
      if (!isUserPasswordValid) {
        throw new CustomError(STATUS_CODES.BAD_REQUEST, 'Incorrect password');
      }

      const validRoles = ['companyAdmin', 'companyMember'];
      if (!validRoles.includes(existingUser?.userRole as string)) {
        throw new CustomError(
          STATUS_CODES.UNAUTHORIZED,
          'You do not have the necessary permissions to log in'
        );
      }

      const companyAccount = existingUser.companyId
        ? await this.companyRepository.findById(
            existingUser.companyId.toString()
          )
        : null;
      if (companyAccount?.isBlocked) {
        throw new CustomError(STATUS_CODES.FORBIDDEN, MESSAGES.BLOCKED);
      }

      const userToken = generateToken({
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.userRole,
        companyId: existingUser.companyId,
        entity: 'user',
      });

      return {
        token: userToken,
        user: existingUser,
        company: companyAccount,
      };
    }

    const existingCompany = await this.companyRepository.findByEmail(email);

    if (!existingCompany) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
        MESSAGES.COMPANY_NOT_FOUND
      );
    }

    if (existingCompany.isBlocked) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.BLOCKED);
    }

    const isCompanyPasswordValid = await comparePassword(
      password,
      existingCompany.password as string
    );
    if (!isCompanyPasswordValid) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
        MESSAGES.INVALID_PASSWORD
      );
    }

    const companyToken = generateToken({
      id: existingCompany._id,
      email: existingCompany.email,
      role: 'companyAdmin',
      entity: 'company',
    });

    return {
      token: companyToken,
      company: existingCompany,
    };
  }
}
