import { hashPassword } from './../../../shared/utils/passwordUtils';
import { CustomError } from '../../../shared/error/customError';
import { CompanyRepository } from '../../../Domain/repository/repo/companyRepository';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';

export class ForgotPasswordUseCase {
  constructor(private companyRepository: CompanyRepository) {}

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

    const hashedNewPassword = await hashPassword(newPassword);

    existingCompany.password = hashedNewPassword;
    const updatedExistingCompany =
      await this.companyRepository.update(existingCompany);

    return updatedExistingCompany;
  }
}
