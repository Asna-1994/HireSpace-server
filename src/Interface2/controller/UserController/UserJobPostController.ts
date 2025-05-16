import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { CustomError } from '../../../shared/error/customError';
import { UserJobPostUseCase } from '../../../Application2/usecases/user/UserJobPostUseCase';


export class UserJobPostController {
  constructor(private userJobPostUseCase: UserJobPostUseCase) {}

  getAllJobPostForUser  = async (req: Request, res: Response, next: NextFunction)  => {
    try {
      const { page = 1, limit = 10, search = '', tagLine = '' } = req.query;
      const allJobPost = await this.userJobPostUseCase.getAllJobPostForUser({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        searchTerm: search as string,
        tagLine: tagLine as string,
      });
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

 getSavedJobPosts  = async (req: Request, res: Response, next: NextFunction)  => {
    try {
      const { userId } = req.params;
      const { search = '' } = req.query;

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const allSavedJobs = await this.userJobPostUseCase.getSavedJobPost(
        userId,
        page,
        limit
      );
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        allSavedJobs,
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }

  reportSpam  = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId, companyId, reason, description } = req.body;

      if (!userId || !companyId || !reason || !description) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Missing required fields'
        );
      }

      const spamReport = await this.userJobPostUseCase.reportSpam({
        reportedByUser: userId,
        companyId,
        reason,
        description,
      });

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: 'Reported Spam',
        spamReport,
      });
    } catch (error) {
      next(error);
    }
  }
}
