import { JobPostRepository } from '../../../Domain/repository/repo/jobPostRepository';
import { UserRepository } from '../../../Domain/repository/repo/userRepository';
import { CompanyRepository } from '../../../Domain/repository/repo/companyRepository';
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import {
  SalaryRange,
  Location,
} from '../../../Infrastructure/models/JobPostModel';
import mongoose from 'mongoose';

export class JobPostUseCase {
  constructor(
    private companyRepository: CompanyRepository,
    private jobPostRepository: JobPostRepository
  ) {}

  async createJobPost(
    companyId: string,
    jobPostData: {
      jobTitle: string;
      description: string;
      skillsRequired: string[];
      responsibilities: string[];
      salaryRange: SalaryRange;
      location: Location;
      jobType: string;
      workMode: string;
      experienceLevel: string;
      educationRequired: string;
      applicationDeadline: Date;
      employmentStartDate: Date;
      numberOfVacancies: number;
      benefits: string[];
      status: string;
    },
    userId: string,
    jobPostId?: string
  ) {
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.COMPANY_NOT_FOUND);
    }

    const isMember = company.members.some(
      (member) =>
        member.userId.toString() === userId &&
        (member.role === 'companyAdmin' || member.role === 'companyMember')
    );

    if (!isMember) {
      throw new CustomError(
        STATUS_CODES.FORBIDDEN,
        'User is not authorized to create a job post for this company.'
      );
    }

    let updatedPost;
    if (jobPostId) {
      const existingJobPost = await this.jobPostRepository.findById(jobPostId);
      if (!existingJobPost) {
        throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.NOT_FOUND);
      }

      existingJobPost.jobTitle = jobPostData.jobTitle;
      existingJobPost.description = jobPostData.description;
      existingJobPost.skillsRequired = jobPostData.skillsRequired;
      existingJobPost.responsibilities = jobPostData.responsibilities;
      existingJobPost.salaryRange = jobPostData.salaryRange;
      existingJobPost.location = jobPostData.location;
      existingJobPost.jobType = jobPostData.jobType;
      existingJobPost.workMode = jobPostData.workMode;
      existingJobPost.experienceLevel = jobPostData.experienceLevel;
      existingJobPost.educationRequired = jobPostData.educationRequired;
      existingJobPost.applicationDeadline = jobPostData.applicationDeadline;
      existingJobPost.employmentStartDate = jobPostData.employmentStartDate;
      existingJobPost.numberOfVacancies = jobPostData.numberOfVacancies;
      existingJobPost.benefits = jobPostData.benefits;
      existingJobPost.status = jobPostData.status;

      updatedPost = await this.jobPostRepository.update(existingJobPost);
    } else {
      updatedPost = await this.jobPostRepository.create({
        ...jobPostData,
        companyId: new mongoose.Types.ObjectId(companyId),
        postedBy: new mongoose.Types.ObjectId(userId),
      });
    }

    return updatedPost;
  }

  //get all post by companyId

  async getAllJobPostByCompanyId(companyId: string) {
    try {
      const allJobPosts = await this.jobPostRepository.find({
        companyId: companyId,
        isDeleted: false,
      });
      return allJobPosts;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error while getting job posts by company Id'
      );
    }
  }

  //delete job post
  async deleteJobPostById(jobPostId: string) {
    try {
      const deletedPost = await this.jobPostRepository.findByIdAndUpdate(
        jobPostId,
        { isDeleted: true },
        { new: true }
      );
      return deletedPost;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error while deleting job posts '
      );
    }
  }
}
