import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { GetAllUsersUseCase } from '../../../Application2/usecases/admin/GetAllUsersUsecase';

export class GetAllUsersController {
  constructor(private getAllUsersUseCase: GetAllUsersUseCase) {}

getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;
      const searchTerm = (req.query.search as string) || '';
      const userRole = (req.query.role as string) || '';

      const { users, total } = await this.getAllUsersUseCase.execute({
        page,
        limit,
        searchTerm,
        userRole,
      });

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        data: {
          users,
          total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getPremiumUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search = '', userRole = '' } = req.query;

      const { users, total } = await this.getAllUsersUseCase.getPremiumUsers({
        page: Number(page),
        limit: Number(limit),
        searchTerm: String(search),
        userRole: String(userRole),
      });

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        data: {
          users,
          total,
          totalPages: Math.ceil(total / Number(limit)),
          currentPage: Number(page),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getSpamReports(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;

      const { spams, total, totalPages, currentPage } =
        await this.getAllUsersUseCase.getAllSpamReports({
          page: Number(page),
          limit: Number(limit),
          searchTerm: String(search),
        });

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        data: {
          rawSpams: spams,
          total,
          totalPages,
          currentPage,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
