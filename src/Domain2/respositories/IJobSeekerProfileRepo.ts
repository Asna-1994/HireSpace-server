import mongoose from 'mongoose';
import { IJobSeekerProfile } from '../entities/JobSeekerProfile';
import { IJobSeekerProfileDTO } from '../../Application2/dto/JobSeekerProfile/JobSeekerProfileDTO';

export interface IJobSeekerProfileRepository {
  findOne(filter: object): Promise<IJobSeekerProfileDTO | null>;
  update(
    jobSeekerProfile: Partial<IJobSeekerProfile>
  ): Promise<IJobSeekerProfileDTO>;
  create(
    jobSeekerProfile: Partial<IJobSeekerProfile>,
    options?: { session?: mongoose.ClientSession }
  ): Promise<IJobSeekerProfileDTO>;
  // create(jobSeekerProfile: Partial<IJobSeekerProfile>): Promise<IJobSeekerProfile>
  // updateByUserId(jobSeekerProfile: Partial<IJobSeekerProfile>): Promise<Partial<IJobSeekerProfile>>
  findOneAndUpdate(
    filter: object,
    update: object,
    options: object
  ): Promise<IJobSeekerProfileDTO | null>;
}
