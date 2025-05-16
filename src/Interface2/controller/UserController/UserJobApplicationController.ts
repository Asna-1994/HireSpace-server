
import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { CustomError } from '../../../shared/error/customError';
import { UserJobApplicationUseCase } from '../../../Application2/usecases/user/UserJobApplicationUseCase';
import mongoose from 'mongoose';

export class UserJobApplicationController {

  constructor(private userJobApplicationUseCase: UserJobApplicationUseCase) {}

   applyForJob = async  (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, jobPostId, companyId } = req.params;
      const { coverLetter } = req.body;
      if (!userId || !jobPostId || !companyId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
        MESSAGES.MISSING_FIELDS
        );
      }

        await this.userJobApplicationUseCase.createJobApplication({
          userId : new mongoose.Types.ObjectId(userId),
          jobPostId : new mongoose.Types.ObjectId(jobPostId),
          coverLetter,
          companyId :  new mongoose.Types.ObjectId(companyId),
        });
      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: MESSAGES.APPLICATION_CREATED,
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }

  //get all applications
  getAllJobApplicationForUser  = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
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

 getHomeStatsForUser  = async (req: Request, res: Response, next: NextFunction)  => {
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
