
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { ICompanyRepository } from '../../../Domain2/respositories/ICompanyRepository';
import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { LoginRequestDTO } from '../../dto/user-auth/LoginDTO';
import { IAuthService } from '../../../Domain2/services/IUserAuthService';

export class CompanyLoginUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private userRepository:IUserRepository,
    private authService : IAuthService
  ) {}

  async execute(loginData: LoginRequestDTO) {
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
          MESSAGES.USER_BLOCKED
        );
      }

      const isUserPasswordValid = await this.authService.comparePassword(password, existingUser.password as string)

      if (!isUserPasswordValid) {
        throw new CustomError(STATUS_CODES.BAD_REQUEST, 'Incorrect password');
      }

      const validRoles = ['companyAdmin', 'companyMember'];
      if (!validRoles.includes(existingUser?.userRole as string)) {
        throw new CustomError(
          STATUS_CODES.UNAUTHORIZED,
         MESSAGES.FORBIDDEN
        );
      }

      if(!existingUser.companyId){
                throw new CustomError(STATUS_CODES.FORBIDDEN,MESSAGES.NOT_ADDED);
      }
      const companyAccount = await this.companyRepository.findById(existingUser.companyId.toString())
       
      if (companyAccount?.isBlocked) {
        throw new CustomError(STATUS_CODES.FORBIDDEN, MESSAGES.BLOCKED);
      }


            const userToken = this.authService.generateAccessToken({
      id: existingUser._id.toString(),
      email: existingUser.email,
      role: existingUser.userRole!,
      entity: 'user',
    });
    const refreshToken = this.authService.generateRefreshToken({
      id: existingUser._id.toString(),
      email: existingUser.email,
      role: existingUser.userRole!,
      entity: 'user',
    });
    
    await this.userRepository.saveRefreshToken(existingUser._id.toString(), refreshToken);

      return {
        token: userToken,
        user: existingUser,
        company: companyAccount,
        refreshToken
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

    const isCompanyPasswordValid = await this.authService.comparePassword(password, existingCompany.password as string)
    if (!isCompanyPasswordValid) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
        MESSAGES.INVALID_PASSWORD
      );
    }


    const companyToken = this.authService.generateAccessToken({
      id: existingCompany._id.toString(),
      email: existingCompany.email,
      role: 'companyAdmin',
        entity: 'company',
    });
    const refreshToken = this.authService.generateRefreshToken({
      id: existingCompany._id.toString() ,
      email: existingCompany.email,
      role: 'companyAdmin',
        entity: 'company',
    });

    await this.companyRepository.saveRefreshToken(existingCompany._id.toString(), refreshToken);

    return {
      token: companyToken,
      refreshToken,
      company: existingCompany,
    };
  }
}
