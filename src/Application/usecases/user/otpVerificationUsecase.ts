import { JobSeekerProfileRepository } from './../../../Domain/repository/repo/JobSeekerProfileRepo';
import { TempUserRepository } from '../../../Domain/repository/repo/tempUserRepository';
import { UserRepository } from '../../../Domain/repository/repo/userRepository';
import { CustomError } from '../../../shared/error/customError';
import { User } from '../../../Domain/entities/User';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import mongoose from 'mongoose';

export class VerifyOtpUseCase {
  constructor(
    private tempUserRepository: TempUserRepository,
    private userRepository: UserRepository,
    private jobSeekerProfileRepository: JobSeekerProfileRepository
  ) {}

  async execute(email: string, otp: string): Promise<User> {
    const tempUser = await this.tempUserRepository.findByEmail(email);
    if (!tempUser) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
    }

    if (tempUser.otp !== otp) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.INVALID);
    }

    if (tempUser.otpExpiry < new Date()) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.EXPIRED);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newUserData = new User({
        userName: tempUser.userName,
        email: tempUser.email,
        phone: tempUser.phone,
        address: tempUser.address,
        dateOfBirth: tempUser.dateOfBirth,
        userRole: tempUser.userRole as
          | 'jobSeeker'
          | 'companyAdmin'
          | 'companyMember'
          | 'admin',
        password: tempUser.password,
        entity: 'user',
      });

      const newUser = await this.userRepository.create(newUserData, {
        session,
      });

      if (tempUser.userRole === 'jobSeeker') {
        await this.jobSeekerProfileRepository.create(
          { userId: new mongoose.Types.ObjectId(newUser._id) },
          { session }
        );
      }

      await this.tempUserRepository.deleteByEmail(email);

      await session.commitTransaction();
      return newUser;
    } catch (error) {
      await session.abortTransaction();
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Registration failed'
      );
    } finally {
      session.endSession();
    }
  }
}

// export class VerifyOtpUseCase {
//   constructor(
//     private tempUserRepository: TempUserRepository,
//     private userRepository: UserRepository,
//     private jobSeekerProfileRepository : JobSeekerProfileRepository
//   ) {}

//   async execute(email: string, otp: string): Promise<User> {

//     const tempUser = await this.tempUserRepository.findByEmail(email);
//     if (!tempUser) {
//       throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
//     }

//     if (tempUser.otp !== otp) {
//       throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.INVALID);
//     }
//     console.log("OTP Expiry:", tempUser.otpExpiry, "Current Time:", Date.now());

//     if (tempUser.otpExpiry < new Date()) {
//       throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.EXPIRED);
//     }

//     const newUserData = new User({
//       userName: tempUser.userName,
//       email: tempUser.email,
//       phone: tempUser.phone,
//       address: tempUser.address,
//       dateOfBirth: tempUser.dateOfBirth,
//       userRole: tempUser.userRole as 'jobSeeker' | 'companyAdmin' | 'companyMember' | 'admin',
//       password: tempUser.password,
//       entity : 'user'
//     });

//    const newUser =  await this.userRepository.create(newUserData);
//     if(tempUser.userRole === 'jobSeeker'){
//       await this.jobSeekerProfileRepository.create({userId :new mongoose.Types.ObjectId(newUser._id )})
//     }
//     await this.tempUserRepository.deleteByEmail(email);

//     return newUser;
//   }
// }
