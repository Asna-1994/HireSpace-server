import { CustomError } from '../../../shared/error/customError';
  import { STATUS_CODES } from '../../../shared/constants/statusCodes';
  import mongoose from 'mongoose';
  import { MESSAGES } from '../../../shared/constants/messages';
  import { IJobSeekerProfileRepository } from '../../../Domain2/respositories/IJobSeekerProfileRepo';
  import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { FileUploadUseCase } from '../shared/FileUploadUsecase';
import { denormalizeJobSeekerProfile } from '../../../shared/utils/Normalisation/normaliseJobSeekerProfile';

 
  
  export class UploadUseCase {
    constructor(
      private jobSeekerProfileRepository: IJobSeekerProfileRepository,
      private userRepository: IUserRepository,
      private fileUploadUseCase : FileUploadUseCase
    ) {}
  
    async uploadProfile(userId: string, file: Express.Multer.File) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.INVALID_FILE_TYPE);
    }

    const user = await this.userRepository.findById(userId);
    if (!user) throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.NOT_FOUND);

    const result = await this.fileUploadUseCase.execute(file.path, 'profile_pictures');
    user.profilePhoto = { url: result.url, publicId: result.publicId };
    return await this.userRepository.update(user);
  }


    async deleteProfilePicture(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);

    if (!user.profilePhoto?.publicId) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, 'No profile picture to delete');
    }

    await this.fileUploadUseCase.deleteFile(user.profilePhoto.publicId);
    user.profilePhoto = { url: '', publicId: '' };
    return await this.userRepository.update(user);
  }
  

    async uploadResume(userId: string, file: Express.Multer.File) {
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.INVALID_FILE_TYPE);
    }

    const result = await this.fileUploadUseCase.execute(file.path, 'resumes');

    let profile = await this.jobSeekerProfileRepository.findOne({ userId });
    if (!profile) {
      profile = await this.jobSeekerProfileRepository.create({
        userId: new mongoose.Types.ObjectId(userId),
        resume: { url: result.url, publicId: result.publicId },
      });
    } else {
      profile.resume = { url: result.url, publicId: result.publicId };
      const normalizedProfile = denormalizeJobSeekerProfile(profile)
      profile = await this.jobSeekerProfileRepository.update(normalizedProfile);
    }

    return profile;
  }



  async deleteResume(userId: string) {
    const profile = await this.jobSeekerProfileRepository.findOne({ userId });
    if (!profile) throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.NO_PROFILE_FOUND);
    if (!profile.resume?.publicId) throw new CustomError(STATUS_CODES.BAD_REQUEST, 'No resume to delete');

    await this.fileUploadUseCase.deleteFile(profile.resume.publicId);
    profile.resume = { url: '', publicId: '' };
    const normalizedProfile = denormalizeJobSeekerProfile(profile)
    return await this.jobSeekerProfileRepository.update(normalizedProfile);
  }
  }
  