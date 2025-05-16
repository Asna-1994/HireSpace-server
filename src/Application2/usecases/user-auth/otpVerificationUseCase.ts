import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import mongoose from 'mongoose';
import { ITempUserRepository } from '../../../Domain2/respositories/ITempUserRepository';
import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { IJobSeekerProfileRepository } from '../../../Domain2/respositories/IJobSeekerProfileRepo';
import { User } from '../../../Domain2/entities/User';

export class VerifyOtpUseCase {
  constructor(
    private tempUserRepository: ITempUserRepository,
    private userRepository: IUserRepository,
    private jobSeekerProfileRepository: IJobSeekerProfileRepository
  ) {}

   execute =  async (email: string, otp: string): Promise<User>  => {
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
      const newUserData = {
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
        entity: 'user' as 'user' | 'company',
      };

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

