import { CustomError } from '../../../shared/error/customError';
  import { STATUS_CODES } from '../../../shared/constants/statusCodes';
  import { MESSAGES } from '../../../shared/constants/messages';
  import { IJobSeekerProfileRepository } from '../../../Domain2/respositories/IJobSeekerProfileRepo';
import { denormalizeJobSeekerProfile } from '../../../shared/utils/Normalisation/normaliseJobSeekerProfile';

  
  
  
  export class ExperienceUseCase {
    constructor(
      private jobSeekerProfileRepository: IJobSeekerProfileRepository,
    ) {}
  
   async addExperience(experienceData: {
    company: string;
    designation: string;
    yearCompleted: string;
    dateFrom: string;
    dateTo: string;
    skillsGained: string[];
    userId: string;
    experienceId?: string;
  }) {
    const {
      company,
      designation,
      yearCompleted,
      dateFrom,
      dateTo,
      skillsGained,
      userId,
      experienceId,
    } = experienceData;

    const experience = {
      company,
      designation,
      yearCompleted,
      dateFrom,
      dateTo,
      skillsGained,
    };

    let updatedProfile;

    if (experienceId) {
      updatedProfile = await this.jobSeekerProfileRepository.findOneAndUpdate(
        { userId, 'workExperience._id': experienceId },
        { $set: { 'workExperience.$': { ...experience, _id: experienceId } } },
        { new: true }
      );
    } else {
      updatedProfile = await this.jobSeekerProfileRepository.findOneAndUpdate(
        { userId },
        { $push: { workExperience: experience } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    if (!updatedProfile) {
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        experienceId
          ? 'Failed to update experience'
          : 'Failed to add experience'
      );
    }

    return updatedProfile.workExperience;
  }

  //get all experience
  async getAllExperience(userId: string) {
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

      return jobSeekerProfile.workExperience;
    } catch (err) {
      console.log(err);
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error in getting all experience details'
      );
    }
  }

  //delete experience by id
  async deleteExperienceById(userId: string, experienceId: string) {
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

      let experienceIndex;
      if (jobSeekerProfile.workExperience) {
        experienceIndex = jobSeekerProfile?.workExperience.findIndex(
          (experience) => experience._id.toString() === experienceId
        );

        if (experienceIndex === -1) {
          throw new CustomError(
            STATUS_CODES.NOT_FOUND,
           MESSAGES.EDUCATION_ID_NOT_FOUND
          );
        }

        jobSeekerProfile.workExperience.splice(experienceIndex as number, 1);
      }
      const normalizedProfile = denormalizeJobSeekerProfile(jobSeekerProfile)
      const updatedProfile =
        await this.jobSeekerProfileRepository.update(normalizedProfile);
      return updatedProfile.workExperience;
    } catch (err) {
      console.log(err);
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error in deleting experience details'
      );
    }
  }
  
  }