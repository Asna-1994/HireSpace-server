import { hashPassword } from './../../../shared/utils/passwordUtils';
import { CustomError } from '../../../shared/error/customError';
import { CompanyRepository } from '../../../Domain/repository/repo/companyRepository';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';

export class ForgotPasswordUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute(companyData: { email: string; newPassword: string }) {
    const { email, newPassword } = companyData;

    const existingCompany = await this.companyRepository.findByEmail(email);
    if (!existingCompany) {
      throw new CustomError(
        STATUS_CODES.NOT_FOUND,
        'No company registered with this email, Please signup first'
      );
    }

    if (existingCompany.isBlocked) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
        'This company has been blocked. Please contact Admin'
      );
    }

    const hashedNewPassword = await hashPassword(newPassword);

    existingCompany.password = hashedNewPassword;
    const updatedExistingCompany =
      await this.companyRepository.update(existingCompany);

    return updatedExistingCompany;
  }
}
