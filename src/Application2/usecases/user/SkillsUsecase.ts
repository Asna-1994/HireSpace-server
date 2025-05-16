

  import { CustomError } from '../../../shared/error/customError';
  import { STATUS_CODES } from '../../../shared/constants/statusCodes';
  import { IJobSeekerProfileRepository } from '../../../Domain2/respositories/IJobSeekerProfileRepo';
import { denormalizeJobSeekerProfile } from '../../../shared/utils/Normalisation/normaliseJobSeekerProfile';

 
  
  export class SkillsUseCase {
    constructor(
      private jobSeekerProfileRepository: IJobSeekerProfileRepository,
    ) {}
  
    async addOrUpdateSkills(userData: {
    hardSkills: string[];
    softSkills: string[];
    technicalSkills: string[];
    userId: string;
  }) {
    const { hardSkills, softSkills, technicalSkills, userId } = userData;

    try {
      const updateObject: any = {};
      if (hardSkills?.length) {
        updateObject['skills.hardSkills'] = { $each: hardSkills };
      }
      if (softSkills?.length) {
        updateObject['skills.softSkills'] = { $each: softSkills };
      }
      if (technicalSkills?.length) {
        updateObject['skills.technicalSkills'] = { $each: technicalSkills };
      }

      const updatedProfile =
        await this.jobSeekerProfileRepository.findOneAndUpdate(
          { userId },
          { $addToSet: updateObject },
          { new: true, upsert: true }
        );

      if (!updatedProfile) {
        throw new CustomError(
          STATUS_CODES.INTERNAL_SERVER_ERROR,
          'Failed to update or add skills'
        );
      }

      return updatedProfile.skills;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'An error occurred while updating or adding skills'
      );
    }
  }

  async getAllSkills(userId: string) {
    try {
      const jobSeekerProfile = await this.jobSeekerProfileRepository.findOne({
        userId: userId,
      });
      if (!jobSeekerProfile) {
        throw new CustomError(
          STATUS_CODES.NOT_FOUND,
          'No profile found for this user'
        );
      }

      return jobSeekerProfile.skills;
    } catch (err) {
      console.log(err);
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error in getting all skill details'
      );
    }
  }

  async deleteSkill(userId: string, skillName: string) {
    try {
      const jobSeekerProfile = await this.jobSeekerProfileRepository.findOne({
        userId: userId,
      });
      if (!jobSeekerProfile) {
        throw new CustomError(
          STATUS_CODES.NOT_FOUND,
          'No profile found for this user'
        );
      }

      if (jobSeekerProfile.skills) {
        if (skillName === 'softskills' && jobSeekerProfile.skills.softSkills) {
          jobSeekerProfile.skills.softSkills = [];
        }

        if (skillName === 'hardskills' && jobSeekerProfile.skills.hardSkills) {
          jobSeekerProfile.skills.hardSkills = [];
        }

        if (
          skillName === 'technicalskills' &&
          jobSeekerProfile.skills.technicalSkills
        ) {
          jobSeekerProfile.skills.technicalSkills = [];
        }
      }

   const normalizedInput = denormalizeJobSeekerProfile(jobSeekerProfile);
      const updatedProfile = await this.jobSeekerProfileRepository.update(normalizedInput);

      return updatedProfile.skills;
    } catch (err) {
      console.log(err);
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error in deleting skill'
      );
    }
  }

  
  }