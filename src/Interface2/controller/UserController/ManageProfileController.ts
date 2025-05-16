import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { CustomError } from '../../../shared/error/customError';
import { ManageProfileUseCase } from '../../../Application2/usecases/user/ManageProfileUseCase';

export class ManageProfileController {
  constructor(private manageProfileUseCase: ManageProfileUseCase) {}



 getJobSeekerProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please Provide the userId'
        );
      }

      const JobSeekerProfile =
        await this.manageProfileUseCase.getJobSeekerProfile(userId);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        data: {
          profile: JobSeekerProfile,
        },
      });
    } catch (error) {
      console.error('Error in getting profile', error);
      next(error);
    }
  }

 saveJob = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>  => {
    try {
      const { userId, jobPostId } = req.params;
      if (!userId || !jobPostId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Provide necessary parameters'
        );
      }
      const updatedUser = await this.manageProfileUseCase.saveJobs(
        userId,
        jobPostId
      );
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.UPDATED,
        user: updatedUser,
      });
    } catch (err) {}
  }

 addTagline = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>  => {
    try {
      const { userId } = req.params;
      const { tagline } = req.body;
      if (!userId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Provide necessary parameters'
        );
      }
      const updatedUser = await this.manageProfileUseCase.addTagLine(
        userId,
        tagline
      );
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.UPDATED,
        user: updatedUser,
      });
    } catch (err) {}
  }

     getResume = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.params;

      if (!userId) {
        throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.USER_ID_REQUIRED);
      }

const resume  = await this.manageProfileUseCase.getResume(userId)

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
       resume
      });
    } catch (error) {
      console.error('Error in getting Resume:', error);
      next(error);
    }
  }


  editBasicDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const { userName, phone, address, dateOfBirth } = req.body;
      if (!userId) {
        throw new CustomError(STATUS_CODES.BAD_REQUEST, 'No used Id');
      }
const data = {
    userId, userName, dateOfBirth, phone, address
}

 const updatedUser = await this.manageProfileUseCase.editBasicDetails(data)

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: 'Successfully Updated',
        data: { user: updatedUser },
      });
    } catch (error) {
      console.error('Error in updating user', error);
      next(error);
    }
  }

}
