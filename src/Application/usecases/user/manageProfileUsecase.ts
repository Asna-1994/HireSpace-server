import { JobApplicationRepository } from './../../../Domain/repository/repo/jobApplicationRepository';
import { UserRepository } from '../../../Domain/repository/repo/userRepository';
import { JobSeekerProfileRepository } from '../../../Domain/repository/repo/JobSeekerProfileRepo';
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import mongoose from 'mongoose';
import { MESSAGES } from '../../../shared/constants/messages';
import { JobApplicationRepositoryImpl } from '../../../Domain/repository/implementation/jobApplicationRepoImpl';

export class ManageProfileUseCase {
  constructor(
    private jobSeekerProfileRepository: JobSeekerProfileRepository,
    private userRepository: UserRepository
  ) {}

  async addEducation(userData: {
    educationName: string;
    yearOfPassing: string;
    markOrGrade: string;
    schoolOrCollege: string;
    subject: string;
    universityOrBoard: string;
    userId: string;
    educationId?: string;
  }) {
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
          'No profile found for this user'
        );
      }
      console.log(jobSeekerProfile.education);
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
          'No profile found for this user'
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
      const updatedProfile =
        await this.jobSeekerProfileRepository.update(jobSeekerProfile);
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

  //add experience

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
          'No profile found for this user'
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
          'No profile found for this user'
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
            'Education with ID not found'
          );
        }

        jobSeekerProfile.workExperience.splice(experienceIndex as number, 1);
      }
      const updatedProfile =
        await this.jobSeekerProfileRepository.update(jobSeekerProfile);
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

  //skills
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

      const updatedProfile =
        await this.jobSeekerProfileRepository.update(jobSeekerProfile);

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

  //certificates

  async addCertificates(certificateData: {
    certificateTitle: string;
    description: string;
    issuer: string;
    issuedDate: string;
    certificateUrl: string;
    userId: string;
    certificateId?: string;
  }) {
    const {
      certificateTitle,
      description,
      issuer,
      issuedDate,
      certificateUrl,
      userId,
      certificateId,
    } = certificateData;

    const certificate = {
      certificateTitle,
      description,
      issuer,
      issuedDate,
      certificateUrl,
    };

    let updatedProfile;

    if (certificateId) {
      updatedProfile = await this.jobSeekerProfileRepository.findOneAndUpdate(
        { userId, 'certificates._id': certificateId },
        { $set: { 'certificates.$': { ...certificate, _id: certificateId } } },
        { new: true }
      );
    } else {
      updatedProfile = await this.jobSeekerProfileRepository.findOneAndUpdate(
        { userId },
        { $push: { certificates: certificate } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    if (!updatedProfile) {
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        certificateId
          ? 'Failed to update certificate'
          : 'Failed to add certificate'
      );
    }

    return updatedProfile.certificates;
  }

  //get certificates
  async getAllCertificates(userId: string) {
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

      return jobSeekerProfile.certificates;
    } catch (err) {
      console.log(err);
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error in getting all certificate details'
      );
    }
  }

  //delete certificate
  async deleteCertificateById(userId: string, certificateId: string) {
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

      let certificateIndex;
      if (jobSeekerProfile.certificates) {
        certificateIndex = jobSeekerProfile?.certificates.findIndex(
          (certificate) => certificate._id.toString() === certificateId
        );

        if (certificateIndex === -1) {
          throw new CustomError(
            STATUS_CODES.NOT_FOUND,
            'Certificate with ID not found'
          );
        }

        jobSeekerProfile.certificates.splice(certificateIndex as number, 1);
      }
      const updatedProfile =
        await this.jobSeekerProfileRepository.update(jobSeekerProfile);
      return updatedProfile.certificates;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error in deleting experience details'
      );
    }
  }

  async getJobSeekerProfile(userId: string) {
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
          'No profile found for this user'
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
}
