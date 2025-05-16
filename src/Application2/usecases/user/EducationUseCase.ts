import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { IJobSeekerProfileRepository } from '../../../Domain2/respositories/IJobSeekerProfileRepo';
import { denormalizeJobSeekerProfile } from '../../../shared/utils/Normalisation/normaliseJobSeekerProfile';
import { AddEducationDTO } from '../../dto/JobSeekerProfile/JobSeekerProfileDTO';



export class EducationUseCase {
  constructor(
    private jobSeekerProfileRepository: IJobSeekerProfileRepository,
  ) {}

  async addEducation(userData: AddEducationDTO) {
    const {
      educationName,
      yearOfPassing,
      markOrGrade,
      
schoolOrCollege,
      subject,
      universityOrBoard,
      userId,
      educationId,
    } = userData;

    const education = {
      educationName,
      yearOfPassing,
      markOrGrade,
      schoolOrCollege,
      subject,
      universityOrBoard,
    };

    let updatedProfile;

    if (educationId) {
      updatedProfile = await this.jobSeekerProfileRepository.findOneAndUpdate(
        { userId, 'education._id': educationId },
        { $set: { 'education.$': { ...education, _id: educationId } } },
        { new: true }
      );
    } else {
      updatedProfile = await this.jobSeekerProfileRepository.findOneAndUpdate(
        { userId },
        { $push: { education: education } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    if (!updatedProfile) {
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        educationId ? 'Failed to update education' : 'Failed to add education'
      );
    }

    return updatedProfile;
  }

  async getAllEducation(userId: string) {
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
      console.log('profile', jobSeekerProfile)
      console.log('education',jobSeekerProfile.education);
      return jobSeekerProfile.education;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error in getting all education details'
      );
    }
  }

  async deleteEducationById(userId: string, educationId: string) {
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

      let educationIndex;
      if (jobSeekerProfile.education) {
        educationIndex = jobSeekerProfile?.education.findIndex(
          (education) => education._id.toString() === educationId
        );

        if (educationIndex === -1) {
          throw new CustomError(
            STATUS_CODES.NOT_FOUND,
            'Education with ID not found'
          );
        }

        jobSeekerProfile.education.splice(educationIndex as number, 1);
      }
      
   const normalizedInput = denormalizeJobSeekerProfile(jobSeekerProfile);
      const updatedProfile = await this.jobSeekerProfileRepository.update(normalizedInput);

      return updatedProfile.education;
    } catch (err) {
      console.log(err);
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error in deleting education details'
      );
    }
  }

}