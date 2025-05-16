import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { CustomError } from '../../../shared/error/customError';
import { ExperienceUseCase } from '../../../Application2/usecases/user/ExperinceUseCase';

export class ExperienceController {
  constructor(private experienceUseCase: ExperienceUseCase) {}


  //add work experience

   addWorkExperience = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> =>  {
    try {
      const {
        company,
        designation,
        yearCompleted,
        dateFrom,
        dateTo,
        skillsGained,
      } = req.body;
      const { userId } = req.params;
      const experienceId =
        typeof req.query.experienceId === 'string'
          ? req.query.experienceId
          : undefined;

      if (
        !company ||
        !yearCompleted ||
        !dateFrom ||
        !dateTo ||
        !designation ||
        !skillsGained
      ) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please fill complete details'
        );
      }
      if (!userId) {
        throw new CustomError(STATUS_CODES.BAD_REQUEST, 'No User Id provided');
      }

      const experienceData = {
        company,
        designation,
        yearCompleted,
        dateFrom,
        dateTo,
        skillsGained,
        experienceId,
        userId,
      };

      const updatedExperience =
        await this.experienceUseCase.addExperience(experienceData);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: 'Experience added successfully',
        data: {
          experience: updatedExperience, // Use the correct field name here
        },
      });
    } catch (error) {
      console.error('Error in adding experience:', error);
      next(error);
    }
  }

  //get all experience

 getAllExperience = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>  => {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please Provide the userId'
        );
      }

      const allExperience =
        await this.experienceUseCase.getAllExperience(userId);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        data: {
          experience: allExperience,
        },
      });
    } catch (error) {
      console.error('Error in getting experience', error);
      next(error);
    }
  }

  //delete experience
   deleteExperience = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, experienceId } = req.params;
      if (!userId || !experienceId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please Provide the required parameters'
        );
      }

      const updatedExperience =
        await this.experienceUseCase.deleteExperienceById(
          userId,
          experienceId
        );

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.UPDATED,
        data: {
          experience: updatedExperience,
        },
      });
    } catch (error) {
      console.error('Error in deleting experience', error);
      next(error);
    }
  }

}
