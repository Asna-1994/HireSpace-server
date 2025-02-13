import { Request, Response, NextFunction } from 'express';
import { DashboardUseCase } from '../../../Application/usecases/admin/dashBoardUseCase';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { CustomError } from '../../../shared/error/customError';

export class DashboardController {
  constructor(private dashboardUseCase: DashboardUseCase) {}

  async getDashboardStats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { startDate, endDate } = req.query;

      if (startDate || endDate) {
        if (!startDate || !endDate) {
          throw new CustomError(STATUS_CODES.BAD_REQUEST, 'Provide both dates');
        }

        const start = new Date(startDate as string);
        const end = new Date(endDate as string);

        if (
          start.toString() === 'Invalid Date' ||
          end.toString() === 'Invalid Date'
        ) {
          throw new CustomError(
            STATUS_CODES.BAD_REQUEST,
            'Invalid date format. Please use YYYY-MM-DD format'
          );
        }

        if (start > end) {
          throw new CustomError(
            STATUS_CODES.BAD_REQUEST,
            "'Start date must be before or equal to end date'"
          );
        }

        const stats = await this.dashboardUseCase.execute({
          startDate: startDate as string,
          endDate: endDate as string,
        });

        res.status(STATUS_CODES.SUCCESS).json({
          success: true,
          stats,
        });
        return;
      }

      const stats = await this.dashboardUseCase.execute();

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        stats,
      });
    } catch (error) {
      console.error('Dashboard controller error:', error);
      next(error);
    }
  }
}
