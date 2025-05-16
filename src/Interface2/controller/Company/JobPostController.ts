
import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { CustomError } from '../../../shared/error/customError';
import { JobPostUseCase } from '../../../Application2/usecases/company/JobPostUseCase';
import { CreateJobPostDTO } from '../../../Application2/dto/JobPost/createJobPostDTO';

export class JobPostController {
  constructor(private jobPostUseCase: JobPostUseCase) {}

  createJobPost = async (req: Request, res: Response, next: NextFunction) =>  {
    try {

      const { companyId, userId } = req.params;
      const jobPostId = req.query.jobPostId 
      console.log(companyId)
   const newJobPostData : CreateJobPostDTO = {
        companyId,
        jobPostData: req.body,
        userId,
        jobPostId : jobPostId?.toString()
}


       await this.jobPostUseCase.createJobPost(newJobPostData);

      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: jobPostId
          ? 'Post Updated Successfully'
          : 'Post Created Successfully',
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }

 getAllJobPost = async (req: Request, res: Response, next: NextFunction)  => {
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

   deleteJobPost = async (req: Request, res: Response, next: NextFunction) => {
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
