import { CustomError } from '../../../shared/error/customError';
import { generateOtp } from '../../../shared/utils/tokenUtils';;
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { ITempCompanyRepository } from '../../../Domain2/respositories/ITempCompanyRepo';
import { ICompanyRepository } from '../../../Domain2/respositories/ICompanyRepository';
import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { IEmailService } from '../../../Domain2/services/IEmailService';
import { companyRegisterDTO } from '../../dto/Company/companyDTO';
import { IAuthService } from '../../../Domain2/services/IUserAuthService';
import { SendOtpDTO } from '../../dto/mail/MailDTO';

export class SignupUseCase {
  constructor(
    private tempCompanyRepository: ITempCompanyRepository,
    private CompanyRepository: ICompanyRepository,
    private userRepository: IUserRepository,
    private emailService: IEmailService,
    private authService  :IAuthService
  ) {}

  async execute(companyData: companyRegisterDTO) {
    const { email, password, companyAdminEmail } = companyData;

    const existingCompany = await this.CompanyRepository.findByEmail(email);
    if (existingCompany) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
        'Company already registered'
      );
    }
    const existingTempCompany =
      await this.tempCompanyRepository.findByEmail(email);
    if (existingTempCompany) {
      await this.tempCompanyRepository.deleteByEmail(email);
    }
    const companyAdmin =
      await this.userRepository.findByEmail(companyAdminEmail);
    if (!companyAdmin) {
      throw new CustomError(
        STATUS_CODES.NOT_FOUND,
       MESSAGES.USER_NOT_FOUND
      );
    }
    if (companyAdmin.userRole !== 'companyAdmin') {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
        'User not registered as a company admin'
      );
    }

    // const hashedPassword = await hashPassword(password);
    const hashedPassword = await this.authService.hashPassword(password)
    const otp = generateOtp();
    console.log(otp);
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);

    const tempCompany = {
      ...companyData,
      password: hashedPassword,
      otp,
      otpExpiry,
    };

    const savedTempCompany =
      await this.tempCompanyRepository.create(tempCompany);

      const sentOtpData:SendOtpDTO = {
        email, otp
      }
    await this.emailService.sendOtpEmail(sentOtpData);

    return savedTempCompany;
  }
}
