import { UserJobApplicationUseCase } from './../../../Application/usecases/user/userJobApplicationUseCase';
import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { CustomError } from '../../../shared/error/customError';

export class UserJobApplicationController {
  constructor(private userJobApplicationUseCase: UserJobApplicationUseCase) {}

  async applyForJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, jobPostId, companyId } = req.params;
      const { coverLetter } = req.body;
      if (!userId || !jobPostId || !companyId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'please provide the necessary parameters'
        );
      }

      const newApplication =
        await this.userJobApplicationUseCase.createJobApplication({
          userId,
          jobPostId,
          coverLetter,
          companyId,
        });
      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: MESSAGES.APPLICATION_CREATED,
        newApplication,
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }

  //get all applications
  async getAllJobApplicationForUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10, searchTerm = '' } = req.query;

      if (!userId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please provide necessary parameters'
        );
      }

      const { allApplications, totalApplications } =
        await this.userJobApplicationUseCase.getAllApplicationForUser(
          userId,
          Number(page),
          Number(limit),
          searchTerm as string
        );

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        allApplications,
        totalApplications,
        currentPage: Number(page),
        totalPages: Math.ceil(totalApplications / Number(limit)),
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }

  async getHomeStatsForUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      if (!userId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please provide necessary parameters'
        );
      }

      const { totalJobPosts, totalJobApplications } =
        await this.userJobApplicationUseCase.getHomeStatics(userId);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        data: {
          totalJobApplications,
          totalJobPosts,
        },
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }
}
