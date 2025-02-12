import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";
import { MESSAGES } from "../../../shared/constants/messages";
import { GetAllCompaniesUseCase } from "../../../Application/usecases/admin/getAllCompaniesUsecase";

export class GetAllCompanyController {
  constructor(private getAllCompaniesUseCase: GetAllCompaniesUseCase) {}

  async getAllCompanies(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 8;
      const searchTerm = (req.query.search as string) || "";

      const { companies, total } = await this.getAllCompaniesUseCase.execute({
        page,
        limit,
        searchTerm,
      });

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        data: {
          companies,
          total,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
