import { IJobApplicationDTO } from './../../dto/JobApplication/JobApplicationDTO';
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { IJobApplicationRepository } from '../../../Domain2/respositories/IJobApplicationRepo';
import { IJobSeekerProfileRepository } from '../../../Domain2/respositories/IJobSeekerProfileRepo';
import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { IJobPostRepository } from '../../../Domain2/respositories/IJobPostRepository';
import { IJobApplication } from '../../../Domain2/entities/JobApplication';


export class UserJobApplicationUseCase {
  constructor(
    private jobApplicationRepository: IJobApplicationRepository,
    private jobSeekerProfileRepository: IJobSeekerProfileRepository,
    private userRepository:IUserRepository,
    private jobPostRepository: IJobPostRepository
  ) {}

  async createJobApplication(
    jobApplicationData: Partial<IJobApplication>
  ): Promise<void> {
    try {
      const { userId, jobPostId, coverLetter, companyId } = jobApplicationData;

      console.log('Received job application data:', jobApplicationData);

      if (!userId || !jobPostId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.MISSING_FIELDS
        );
      }

      if (!coverLetter) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please add cover letter'
        );
      }

      const existingApplication = await this.jobApplicationRepository.findOne({
        userId,
        jobPostId,
        isDeleted: false,
      });

      if (existingApplication) {
        throw new CustomError(
          STATUS_CODES.CONFLICT,
          'You have already applied for this job.'
        );
      }

      const user = await this.userRepository.findById(userId.toString());
      if (!user) {
        throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
      }

      if (!user.isPremium) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentApplicationsCount =
          await this.jobApplicationRepository.count({
            userId,
            appliedDate: { $gte: thirtyDaysAgo },
          });

        if (recentApplicationsCount >= 10) {
          throw new CustomError(
            STATUS_CODES.FORBIDDEN,
            MESSAGES.MAXIMUM_LIMIT
          );
        }
      }

      const jobSeekerProfile = await this.jobSeekerProfileRepository.findOne({
        userId,
      });

      const newJobApplicationData: Partial<IJobApplication> = {
        ...jobApplicationData,
        appliedDate: new Date(),
        updatedDate: new Date(),
        status: 'pending',
      };

      if (!jobSeekerProfile?.resume?.url) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          MESSAGES.PLEASE_UPLOAD_RESUME
        );
      }
      newJobApplicationData.resumeUrl = jobSeekerProfile.resume.url;
      newJobApplicationData.coverLetter = coverLetter;

      await this.jobApplicationRepository.create(newJobApplicationData);

      return 
    } catch (err) {
      console.error('Error in createJobApplication:', err);
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error while creating job application'
      );
    }
  }

  async getAllApplicationForUser(
    userId: string,
    page: number,
    limit: number,
    searchTerm?: string
  ) {
    try {
      const skip = (page - 1) * limit;
      const query: any = { userId: userId, isDeleted: false };

      if (searchTerm) {
        query.$or = [
          { 'jobPostId.jobTitle': { $regex: searchTerm, $options: 'i' } },
          {
            'jobPostId.companyId.companyName': {
              $regex: searchTerm,
              $options: 'i',
            },
          },
        ];
      }

      const { jobApplications: allApplications, totalApplications } =
        await this.jobApplicationRepository.findApplicationWithPagination(
          skip,
          limit,
          query
        );

      return { allApplications, totalApplications };
    } catch (err) {
      console.error('Error in getting bApplication:', err);
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error while getting applications'
      );
    }
  }

  //get home statics
  async getHomeStatics(userId: string) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new CustomError(
          STATUS_CODES.NOT_FOUND,
    MESSAGES.NO_PROFILE_FOUND
        );
      }

      const totalJobApplications =
        await this.jobApplicationRepository.countTotal({ userId: userId });
      const totalJobPosts = await this.jobPostRepository.countTotal({
        isDeleted: false,
        status: 'Active',
      });

      return { totalJobPosts, totalJobApplications };
    } catch (err) {
      console.log(err);
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error in getting details for home'
      );
    }
  }
}
