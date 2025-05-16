import { CustomError } from '../../../shared/error/customError';
  import { STATUS_CODES } from '../../../shared/constants/statusCodes';
  import mongoose from 'mongoose';
  import { MESSAGES } from '../../../shared/constants/messages';
  import { IJobSeekerProfileRepository } from '../../../Domain2/respositories/IJobSeekerProfileRepo';
  import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { EditBasicDTO } from '../../dto/user-auth/EditBasicDTO';
 
  
  export class ManageProfileUseCase {
    constructor(
      private jobSeekerProfileRepository: IJobSeekerProfileRepository,
      private userRepository: IUserRepository
    ) {}
  
  
  
      async getJobSeekerProfile(userId: string) {
    try {
      const jobSeekerProfile = await this.jobSeekerProfileRepository.findOne({
        userId: userId,
      });
      if (!jobSeekerProfile) {
        throw new CustomError(
          STATUS_CODES.NOT_FOUND,
        MESSAGES.NO_PROFILE_FOUND
        );
      }

      return jobSeekerProfile;
    } catch (err) {
      console.log(err);
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error in getting profile'
      );
    }
  }

  //save jobs
  async saveJobs(userId: string, jobPostId: string) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
      }

      const jobPostIdObject = new mongoose.Types.ObjectId(jobPostId);

      if (user.savedJobs.includes(jobPostIdObject)) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Job post already saved'
        );
      }
      user.savedJobs.push(jobPostIdObject);

      const updatedUser = await this.userRepository.update(user);
      return updatedUser;
    } catch (err) {
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error in getting all education details'
      );
      console.log(err);
    }
  }

  //add tagline
  async addTagLine(userId: string, tagline: string) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new CustomError(
          STATUS_CODES.NOT_FOUND,
        MESSAGES.NO_PROFILE_FOUND
        );
      }

      user.tagLine = tagline;

      const updatedUser = await this.userRepository.update(user);
      return updatedUser;
    } catch (err) {
      console.log(err);
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error in adding'
      );
    }
  }

  async getResume(userId : string)  {

      const jobSeekerProfile = await this.jobSeekerProfileRepository.findOne({
        userId: userId,
      });
      if (!jobSeekerProfile) {
        throw new CustomError(
          STATUS_CODES.NOT_FOUND,
         MESSAGES.NO_PROFILE_FOUND
        );
      }
 return jobSeekerProfile.resume
  }

  
  async editBasicDetails(data :EditBasicDTO ){

    const { userId, userName, phone, dateOfBirth, address } = data
     const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.NOT_FOUND);
      }

      user.userName = userName;
      user.address = address;
      user.phone = phone;
      user.dateOfBirth = dateOfBirth;

      const updatedUser = await this.userRepository.update(user);

      return updatedUser

  }
  }
  