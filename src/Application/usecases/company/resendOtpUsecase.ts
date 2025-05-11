import { TempCompany } from '../../../Domain/entities/tempCompany';
import { TempCompanyRepository } from '../../../Domain/repository/repo/tempCompanyRepository';
import { sendOtpEmail } from '../../../Infrastructure/email/emailService';
import { MESSAGES } from '../../../shared/constants/messages';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { CustomError } from '../../../shared/error/customError';

import { generateOtp } from '../../../shared/utils/tokenUtils';

export class ResendOtpUseCase {
  constructor(
    private tempCompanyRepository: TempCompanyRepository,
    private emailService: typeof sendOtpEmail
  ) {}

  async execute(email: string): Promise<TempCompany> {
    const existingTempCompany =
      await this.tempCompanyRepository.findByEmail(email);
    if (!existingTempCompany) {
      throw new CustomError(
        STATUS_CODES.NOT_FOUND,
      MESSAGES.COMPANY_NOT_FOUND
      );
    }

    const otp = generateOtp();
    console.log('resend otp', otp);
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);

    existingTempCompany.otp = otp;
    existingTempCompany.otpExpiry = otpExpiry;
    const updatedExistingTempCompany =
      await this.tempCompanyRepository.updateOne(existingTempCompany);

    if (!updatedExistingTempCompany) {
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Failed to update Company with new OTP'
      );
    }
    await this.emailService(email, otp);

    return updatedExistingTempCompany;
  }
}
