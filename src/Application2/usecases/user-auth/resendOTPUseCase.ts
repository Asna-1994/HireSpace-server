import { CustomError } from '../../../shared/error/customError';
import { generateOtp } from '../../../shared/utils/tokenUtils';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { ITempUserRepository } from '../../../Domain2/respositories/ITempUserRepository';
import { IEmailService } from '../../../Domain2/services/IEmailService';
import { SendOtpDTO } from '../../dto/mail/MailDTO';
import { ITempUser } from '../../../Domain2/entities/TempUser';

export class ResendOtpUseCase {
  constructor(
    private tempUserRepository: ITempUserRepository,
    private emailService : IEmailService
  ) {}

   execute = async (email: string): Promise<ITempUser> => {
    const existingTempUser = await this.tempUserRepository.findByEmail(email);
    if (!existingTempUser) {
      throw new CustomError(
        STATUS_CODES.NOT_FOUND,
   MESSAGES.USER_NOT_FOUND
      );
    }

    const otp = generateOtp();
    console.log('resend otp', otp);
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);

    existingTempUser.otp = otp;
    existingTempUser.otpExpiry = otpExpiry;
    const updatedExistingTempUser =
      await this.tempUserRepository.updateOne(existingTempUser);

    if (!updatedExistingTempUser) {
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Failed to update user with new OTP'
      );
    }

    const sentOtpData : SendOtpDTO = {
        email,
        otp
    }
    await this.emailService.sendOtpEmail(sentOtpData);

    return updatedExistingTempUser;
  }
}
