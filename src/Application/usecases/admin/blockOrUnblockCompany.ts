import { CustomError } from '../../../shared/error/customError';
import { CompanyRepository } from '../../../Domain/repository/repo/companyRepository';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { sendVerificationStatusMail } from '../../../Infrastructure/email/emailService';

export class BlockOrUnblockCompanyUseCase {
  constructor(private CompanyRepository: CompanyRepository) {}

  async execute(companyId: string, action: string) {
    const updatedCompany = await this.CompanyRepository.blockOrUnblock(
      companyId,
      action
    );

    if (!updatedCompany) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, 'Company not found');
    }
    return updatedCompany;
  }

  async verifyCompany(companyId: string) {
    try {
      const company = await this.CompanyRepository.findById(companyId);
      if (!company) {
        throw new CustomError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMPANY_NOT_FOUND
        );
      }
      company.isVerified = true;
      const updatedCompany = await this.CompanyRepository.update(company);
      sendVerificationStatusMail(
        company.email,
        company.companyName,
        'approved'
      );
      return updatedCompany;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Failed to verify company'
      );
    }
  }
}
