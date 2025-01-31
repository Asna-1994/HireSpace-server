import { TempUserRepository } from '../../../Domain/repository/repo/tempUserRepository';
import { sendOtpEmail } from "../../../Infrastructure/email/emailService";
import { CustomError } from "../../../shared/error/customError";
import { TempUser } from "../../../Domain/entities/tempUser";
import { generateOtp } from "../../../shared/utils/tokenUtils";
import { STATUS_CODES } from '../../../shared/constants/statusCodes';


export class ResendOtpUseCase {
  constructor(
    private tempUserRepository: TempUserRepository,
    private emailService:typeof  sendOtpEmail 
  ) {}

  async execute(email: string): Promise<TempUser> {
 

    const existingTempUser = await this.tempUserRepository.findByEmail(email);
    if (!existingTempUser) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, "No user fround  to send otp");
    }
 

    const otp = generateOtp();
    console.log("resend otp",otp)
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);  

 existingTempUser.otp = otp;
 existingTempUser.otpExpiry = otpExpiry
const updatedExistingTempUser= await this.tempUserRepository.updateOne(existingTempUser)

if (!updatedExistingTempUser) {
    throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, "Failed to update user with new OTP");
  }
    await this.emailService(email, otp);

    return updatedExistingTempUser 
  }

}
