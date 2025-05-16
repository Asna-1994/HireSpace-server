
import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';

import { CustomError } from '../../../shared/error/customError';
import { SkillsUseCase } from '../../../Application2/usecases/user/SkillsUsecase';

export class SkillsController {

  constructor(private skillsUseCase: SkillsUseCase) {}


 addSkills = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { hardSkills, softSkills, technicalSkills } = req.body;
      const { userId } = req.params;

      if (!userId) {
        throw new CustomError(STATUS_CODES.BAD_REQUEST, 'No User Id provided');
      }

      const skillsData = {
        hardSkills,
        softSkills,
        technicalSkills,
        userId,
      };

      const updatedSkills =
        await this.skillsUseCase.addOrUpdateSkills(skillsData);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: 'Experience added successfully',
        data: {
          skills: updatedSkills,
        },
      });
    } catch (error) {
      console.error('Error in adding experience:', error);
      next(error);
    }
  }

  //get all skills
 getAllSkills = async (
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

      const allSkills = await this.skillsUseCase.getAllSkills(userId);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        data: {
          skills: allSkills,
        },
      });
    } catch (error) {
      console.error('Error in getting experience', error);
      next(error);
    }
  }

  //delete skill
 deleteSkill = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> =>  {
    try {
      const { userId } = req.params;
      const { skillName } = req.body;
      if (!userId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please Provide the required parameters'
        );
      }

      const updatedSkills = await this.skillsUseCase.deleteSkill(
        userId,
        skillName
      );

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.UPDATED,
        data: {
          skills: updatedSkills,
        },
      });
    } catch (error) {
      console.error('Error in deleting skills', error);
      next(error);
    }
  }
}