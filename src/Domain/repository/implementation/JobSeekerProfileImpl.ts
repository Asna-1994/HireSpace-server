import mongoose from "mongoose";
import { JobSeekerProfileModel } from "../../../Infrastructure/models/JobSeekerProfileModel";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";
import { CustomError } from "../../../shared/error/customError";
import {
  JobSeekerProfile,
  normalizeJobSeekerProfile,
} from "../../entities/JobSeekerProfile";
import { JobSeekerProfileRepository } from "../repo/JobSeekerProfileRepo";

export class JobSeekerProfileImpl implements JobSeekerProfileRepository {
  async findOne(filter: object): Promise<JobSeekerProfile> {
    const jobSeekerProfile = await JobSeekerProfileModel.findOne(filter);
    return jobSeekerProfile as JobSeekerProfile;
  }

  async update(
    jobSeekerProfile: Partial<JobSeekerProfile>,
  ): Promise<JobSeekerProfile> {
    if (!jobSeekerProfile._id) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, "Profile ID is required");
    }

    const updatedProfile = await JobSeekerProfileModel.findByIdAndUpdate(
      jobSeekerProfile._id,
      { $set: jobSeekerProfile },
      { new: true, lean: true },
    ).exec();

    if (!updatedProfile) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, "Profile not found");
    }

    return normalizeJobSeekerProfile(updatedProfile);
  }

  // async updateByUserId(jobSeekerProfile: Partial<JobSeekerProfile>): Promise<Partial<JobSeekerProfile>> {
  //   if (!jobSeekerProfile._id) {
  //     throw new CustomError(STATUS_CODES.BAD_REQUEST, "Profile ID is required");
  //   }

  //   const updatedProfile = await JobSeekerProfileModel.findByIdAndUpdate(
  //     jobSeekerProfile._id,
  //     { $set: jobSeekerProfile },
  //     { new: true, lean: true }
  //   ).exec();

  //   if (!updatedProfile) {
  //     throw new CustomError(STATUS_CODES.NOT_FOUND, "Profile not found");
  //   }

  //   return normalizeJobSeekerProfile(updatedProfile);
  // }

  async findOneAndUpdate(
    filter: object,
    update: object,
    options: object,
  ): Promise<JobSeekerProfile> {
    const jobSeekerProfile = await JobSeekerProfileModel.findOneAndUpdate(
      filter,
      update,
      options,
    );
    return normalizeJobSeekerProfile(jobSeekerProfile);
  }

  // async create(jobSeekerProfile: Partial<JobSeekerProfile>): Promise<JobSeekerProfile> {
  //   if (!jobSeekerProfile.userId) {
  //     throw new CustomError(STATUS_CODES.BAD_REQUEST, "User ID is required");
  //   }

  //   const newJobSeekerProfile = new JobSeekerProfileModel({
  //     ...jobSeekerProfile,
  //     userId: new mongoose.Types.ObjectId(jobSeekerProfile.userId),
  //   });

  //   const savedProfile = await newJobSeekerProfile.save();
  //   return normalizeJobSeekerProfile(savedProfile);
  // }

  async create(
    jobSeekerProfile: Partial<JobSeekerProfile>,
    options?: { session?: mongoose.ClientSession },
  ): Promise<JobSeekerProfile> {
    if (!jobSeekerProfile.userId) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, "User ID is required");
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
