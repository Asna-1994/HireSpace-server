import { CustomError } from '../../../shared/error/customError';
import { generateOtp } from '../../../shared/utils/tokenUtils';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { RegisterRequestDTO } from '../../dto/user-auth/RegisterDTO';
import { IEmailService } from '../../../Domain2/services/IEmailService';
import { ITempUserRepository } from '../../../Domain2/respositories/ITempUserRepository';
import { IAuthService } from '../../../Domain2/services/IUserAuthService';

export class UserSignupUseCase {
  constructor(
    private tempUserRepository: ITempUserRepository,
    private UserRepository: IUserRepository,
    private emailService: IEmailService,
    private authService : IAuthService
  ) {}

 execute =  async (userData: RegisterRequestDTO) => {
    const { email, password, phone } = userData;

    const existingUser = await this.UserRepository.findByEmail(email);
    if (existingUser) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.USER_EXISTS);
    }
    const existingTempUser = await this.tempUserRepository.findByEmail(email);
    if (existingTempUser) {
      await this.tempUserRepository.deleteByEmail(email);
    }

    const hashedPassword = await this.authService.hashPassword(password);
    const otp = generateOtp();
    console.log(otp);
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);

    const tempUser = {
      ...userData,
      password: hashedPassword,
      otp,
      otpExpiry,
    }

    await this.tempUserRepository.create(tempUser);

    await this.emailService.sendOtpEmail({email, otp});
    // await this.smsService(phone, otp);

    return tempUser;
  }
}
