import { sendOtpSms } from './../../../Infrastructure/email/emailService';
import { UserRepository } from '../../../Domain/repository/repo/userRepository';
import { TempUserRepository } from "../../../Domain/repository/repo/tempUserRepository";
import { sendOtpEmail } from "../../../Infrastructure/email/emailService";
import { CustomError } from "../../../shared/error/customError";
import { TempUser } from "../../../Domain/entities/tempUser";
import { generateOtp } from "../../../shared/utils/tokenUtils";
import { hashPassword } from '../../../shared/utils/passwordUtils';

export class SignupUseCase {
  constructor(
    private tempUserRepository: TempUserRepository,
    private UserRepository : UserRepository,
    private emailService:typeof  sendOtpEmail ,
    private smsService : typeof sendOtpSms
  ) {}

  async execute(userData: {
    userName: string;
    email: string;
    dateOfBirth: Date;
    phone: string;
    address: string;
    userRole: string;
    password: string;
    
  }) {
    const { email , password, phone} = userData;

    const existingUser = await this.UserRepository.findByEmail(email);
    if (existingUser) {
      throw new CustomError(400, "User already registered");
    }
    const existingTempUser = await this.tempUserRepository.findByEmail(email);
    if (existingTempUser) {
     await this.tempUserRepository.deleteByEmail(email)
    }

    const hashedPassword = await hashPassword(password)
    const otp = generateOtp();
    console.log(otp)
    const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);  

    const tempUser = new TempUser({
      ...userData,
      password : hashedPassword,
      otp,
      otpExpiry
    });


    await this.tempUserRepository.create(tempUser);

    await this.emailService(email, otp);
    // await this.smsService(phone, otp);

    return tempUser;  
  }

}
