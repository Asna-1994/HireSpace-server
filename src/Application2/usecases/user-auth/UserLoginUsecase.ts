
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { LoginRequestDTO } from '../../dto/user-auth/LoginDTO';
import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { IAuthService } from '../../../Domain2/services/IUserAuthService';

export class UserLoginUseCase {
  constructor(
    private UserRepository: IUserRepository,
      private authService: IAuthService
  ) {}

execute =  async(data: LoginRequestDTO) => {
    const { email, password } = data

    const existingUser = await this.UserRepository.findByEmail(email);
console.log(email)
console.log(existingUser)
    if (!existingUser) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
    }

    if (existingUser.isBlocked) {
      throw new CustomError(STATUS_CODES.FORBIDDEN, 'User is blocked');
    }

    const isPasswordValid = await this.authService.comparePassword(
      data.password,
      existingUser.password!
    );

    if (!isPasswordValid) {
      throw new CustomError(
        STATUS_CODES.UNAUTHORIZED,
        MESSAGES.INVALID_PASSWORD
      );
    }

    if (existingUser.userRole !== 'jobSeeker') {
      throw new CustomError(
        STATUS_CODES.UNAUTHORIZED,
        'You are not registered as a job seeker. If you are company member please login from company side'
      );
    }

    // const token = generateAccessToken({
    //   id: existingUser._id,
    //   email: existingUser.email,
    //   role: existingUser.userRole,
    //   entity: 'user',
    // });
    // const refreshToken = generateRefreshToken({
    //   id: existingUser._id,
    //   email: existingUser.email,
    //   role: existingUser.userRole,
    //   entity: 'user',
    // });
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

    return { token, refreshToken, user: existingUser };
  }


}
