import mongoose from 'mongoose';
import { JobSeekerProfile } from '../../entities/JobSeekerProfile';

export interface JobSeekerProfileRepository {
  findOne(filter: object): Promise<JobSeekerProfile | null>;
  update(
    jobSeekerProfile: Partial<JobSeekerProfile>
  ): Promise<JobSeekerProfile>;
  create(
    jobSeekerProfile: Partial<JobSeekerProfile>,
    options?: { session?: mongoose.ClientSession }
  ): Promise<JobSeekerProfile>;
  // create(jobSeekerProfile: Partial<JobSeekerProfile>): Promise<JobSeekerProfile>
  // updateByUserId(jobSeekerProfile: Partial<JobSeekerProfile>): Promise<Partial<JobSeekerProfile>>
  findOneAndUpdate(
    filter: object,
    update: object,
    options: object
  ): Promise<JobSeekerProfile>;
}
