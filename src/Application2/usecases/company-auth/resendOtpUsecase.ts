
import { ITempCompany } from '../../../Domain2/entities/TempCompany';
import { ITempCompanyRepository } from '../../../Domain2/respositories/ITempCompanyRepo';
import { IEmailService } from '../../../Domain2/services/IEmailService';
import { MESSAGES } from '../../../shared/constants/messages';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { CustomError } from '../../../shared/error/customError';

import { generateOtp } from '../../../shared/utils/tokenUtils';
import { SendOtpDTO } from '../../dto/mail/MailDTO';

export class ResendOtpUseCase {
  constructor(
    private tempCompanyRepository: ITempCompanyRepository,
    private emailService: IEmailService
  ) {}

  async execute(email: string): Promise<ITempCompany> {
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

    const sentOtpData : SendOtpDTO = {
      email, otp
    }
    await this.emailService.sendOtpEmail(sentOtpData);

    return updatedExistingTempCompany;
  }
}
