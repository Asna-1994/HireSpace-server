import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { ICompanyRepository } from '../../../Domain2/respositories/ICompanyRepository';
import { IAuthService } from '../../../Domain2/services/IUserAuthService';
import { denormalizeCompany } from '../../../shared/utils/Normalisation/normaliseCompany';

export class ForgotPasswordUseCase {
  constructor(private companyRepository:ICompanyRepository,
    private authService :IAuthService
  ) {}

  async execute(companyData: { email: string; newPassword: string }) {
    const { email, newPassword } = companyData;

    const existingCompany = await this.companyRepository.findByEmail(email);
    if (!existingCompany) {
      throw new CustomError(
        STATUS_CODES.NOT_FOUND,
        MESSAGES.COMPANY_NOT_FOUND
      );
    }

    if (existingCompany.isBlocked) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
        MESSAGES.COMPANY_BLOCKED
      );
    }

    const hashedNewPassword = await this.authService.hashPassword(newPassword)
    // const hashedNewPassword = await hashPassword(newPassword);

    existingCompany.password = hashedNewPassword;
    const denormalized  = denormalizeCompany(existingCompany)
    const updatedExistingCompany =
      await this.companyRepository.update(denormalized);

    return updatedExistingCompany;
  }
}
