import mongoose from 'mongoose';

import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { CustomError } from '../../../shared/error/customError';
import { IJobSeekerProfileRepository } from '../../../Domain2/respositories/IJobSeekerProfileRepo';
import { JobSeekerProfileModel } from '../models/JobSeekerProfileModel';
import { IJobSeekerProfileDTO } from '../../../Application2/dto/JobSeekerProfile/JobSeekerProfileDTO';
import { IJobSeekerProfile } from '../../../Domain2/entities/JobSeekerProfile';
import { normalizeJobSeekerProfile } from '../../../shared/utils/Normalisation/normaliseJobSeekerProfile';


export class JobSeekerProfileRepository implements IJobSeekerProfileRepository {

  async findOne(filter: object): Promise<IJobSeekerProfileDTO | null> {
    const jobSeekerProfile = await JobSeekerProfileModel.findOne(filter);
    console.log('Pfile from repo', jobSeekerProfile)
    return jobSeekerProfile ?  normalizeJobSeekerProfile(jobSeekerProfile) : null
  }

  async update(jobSeekerProfile: Partial<IJobSeekerProfile>): Promise<IJobSeekerProfileDTO> {
    if (!jobSeekerProfile._id) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, 'Profile ID is required');
    }

    const updatedProfile = await JobSeekerProfileModel.findByIdAndUpdate(
   new mongoose.Types.ObjectId(jobSeekerProfile._id),
      { $set: jobSeekerProfile },
      { new: true, lean: true }
    ).exec();

    if (!updatedProfile) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, 'Profile not found');
    }

    return normalizeJobSeekerProfile(updatedProfile);
  }



  async findOneAndUpdate(
    filter: object,
    update: object,
    options: object
  ): Promise<IJobSeekerProfileDTO  | null> {
    const jobSeekerProfile = await JobSeekerProfileModel.findOneAndUpdate(
      filter,
      update,
      options
    );
    return jobSeekerProfile ?  normalizeJobSeekerProfile(jobSeekerProfile) : null;
  }



  async create(
    jobSeekerProfile: Partial<IJobSeekerProfile>,
    options?: { session?: mongoose.ClientSession }
  ): Promise<IJobSeekerProfileDTO> {
    if (!jobSeekerProfile.userId) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, 'User ID is required');
    }

    const newJobSeekerProfile = new JobSeekerProfileModel({
      ...jobSeekerProfile,
      userId: new mongoose.Types.ObjectId(jobSeekerProfile.userId),
    });

    const session = options?.session;

    const savedProfile = session
      ? await newJobSeekerProfile.save({ session })
      : await newJobSeekerProfile.save();

    return normalizeJobSeekerProfile(savedProfile);
  }
}
