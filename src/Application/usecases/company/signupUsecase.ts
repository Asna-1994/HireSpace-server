import { sendOtpEmail } from "../../../Infrastructure/email/emailService";
import { CustomError } from "../../../shared/error/customError";
import { generateOtp } from "../../../shared/utils/tokenUtils";
import { hashPassword } from "../../../shared/utils/passwordUtils";
import { TempCompanyRepository } from "../../../Domain/repository/repo/tempCompanyRepository";
import { CompanyRepository } from "../../../Domain/repository/repo/companyRepository";
import { TempCompany } from "../../../Domain/entities/tempCompany";
import { UserRepository } from "../../../Domain/repository/repo/userRepository";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";

export class SignupUseCase {
  constructor(
    private tempCompanyRepository: TempCompanyRepository,
    private CompanyRepository: CompanyRepository,
    private userRepository: UserRepository,
    private emailService: typeof sendOtpEmail,
  ) {}

  async execute(companyData: {
    companyName: string;
    email: string;
    establishedDate: Date;
    phone: string;
    address: string;
    industry: string;
    password: string;
    companyAdminEmail: string;
  }) {
    const { email, password, companyAdminEmail } = companyData;

    const existingCompany = await this.CompanyRepository.findByEmail(email);
    if (existingCompany) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
        "Company already registered",
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
        "No user found with this email",
      );
    }
    if (companyAdmin.userRole !== "companyAdmin") {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
        "User not registered as a company admin",
      );
    }

    const hashedPassword = await hashPassword(password);
    const otp = generateOtp();
    console.log(otp);
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);

    const tempCompany = new TempCompany({
      ...companyData,
      password: hashedPassword,
      otp,
      otpExpiry,
    });

    const savedTempCompany =
      await this.tempCompanyRepository.create(tempCompany);

    await this.emailService(email, otp);

    return savedTempCompany;
  }
}
