import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { CustomError } from '../../../shared/error/customError';
import { CompanyJobApplicationUseCase } from '../../../Application2/usecases/company/CompanyJobApplicationUseCase';


export class CompanyJobApplicationController {
  constructor(
    private companyJobApplicationUseCase: CompanyJobApplicationUseCase
  ) {}

  //get all applications
   getAllJobApplicationForCompany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { companyId } = req.params;
      const {
        page = 1,
        limit = 10,
        status = '',
        search = '',
        jobPostId,
      } = req.query;

      if (!companyId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please provide the companyId parameter.'
        );
      }

      // Fetch job applications with the necessary filters and pagination
      const { jobApplications, totalApplications, totalPages, currentPage } =
        await this.companyJobApplicationUseCase.getAllApplicationForCompany({
          companyId,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          searchTerm: search as string,
          status: status as string,
          jobPostId: jobPostId ? jobPostId.toString() : undefined,
        });

      // Send response with data and pagination information
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        applications: jobApplications,
        totalApplications,
        totalPages,
        currentPage,
      });
    } catch (error) {
      next(error);
    }
  }

  //update status
  updateApplicationStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  )  => {
    try {
      const { applicationId } = req.params;
      const { status } = req.body;

      if (!applicationId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please provide necessary parameters'
        );
      }

      console.log(applicationId, status);

      const application = await this.companyJobApplicationUseCase.updateStatus(
        applicationId,
        status
      );
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.SUCCESSFULLY_UPDATED,
        application,
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }
}
