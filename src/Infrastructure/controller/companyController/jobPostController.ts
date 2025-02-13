import { JobPostUseCase } from './../../../Application/usecases/company/jobPostUseCase';
import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { CustomError } from '../../../shared/error/customError';

export class JobPostController {
  constructor(private jobPostUseCase: JobPostUseCase) {}

  async createJobPost(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        jobTitle,
        description,
        skillsRequired,
        responsibilities,
        salaryRange,
        location,
        workMode,
        jobType,
        experienceLevel,
        educationRequired,
        postedBy,
        applicationDeadline,
        employmentStartDate,
        numberOfVacancies,
        benefits,
      } = req.body;
      const { companyId, userId } = req.params;
      const jobPostId =
        typeof req.query.jobPostId === 'string'
          ? req.query.jobPostId
          : undefined;

      const newJobPost = await this.jobPostUseCase.createJobPost(
        companyId,
        req.body,
        userId,
        jobPostId
      );

      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: jobPostId
          ? 'Post Updated Successfully'
          : 'Post Created Successfully',
        data: {
          jobPost: newJobPost,
        },
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }

  async getAllJobPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = req.params;
      if (!companyId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please provide company Id'
        );
      }

      const allJobPost =
        await this.jobPostUseCase.getAllJobPostByCompanyId(companyId);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        allJobPost,
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }

  //deleteing post
  async deleteJobPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobPostId } = req.params;
      if (!jobPostId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please provide post Id'
        );
      }

      const updatedPost =
        await this.jobPostUseCase.deleteJobPostById(jobPostId);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.UPDATED,
        updatedPost,
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }
}
