import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { CustomError } from '../../../shared/error/customError';
import { EducationUseCase } from '../../../Application2/usecases/user/EducationUseCase';
import { AddEducationDTO, EducationDTO } from '../../../Application2/dto/JobSeekerProfile/JobSeekerProfileDTO';


export class EducationController {
  constructor(private educationUseCase: EducationUseCase) {}

 addEducation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        educationName,
        yearOfPassing,
        markOrGrade,
        schoolOrCollege,
        subject,
        universityOrBoard,
      } = req.body;
      const { userId } = req.params;
      const educationId = req.query.educationId 
     

      if (
        !educationName ||
        !yearOfPassing ||
        !markOrGrade ||
        !schoolOrCollege ||
        !subject ||
        !universityOrBoard
      ) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please fill complete details'
        );
      }
      if (!userId) {
        throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.USER_ID_REQUIRED);
      }

      const eductionDataData  = {
        educationName,
        yearOfPassing,
        markOrGrade,
        schoolOrCollege,
        subject,
        universityOrBoard,
      };

      const updatedProfile =
        await this.educationUseCase.addEducation({...eductionDataData, userId ,educationId :  educationId as string});

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: 'Education added successfully',
        data: {
          updatedProfile,
        },
      });
    } catch (error) {
      console.error('Error in adding education:', error);
      next(error);
    }
  }

  //get all education
  getAllEducation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>  =>{
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please Provide the userId'
        );
      }

      const allEducation = await this.educationUseCase.getAllEducation(userId);
      console.log('all education' , allEducation);
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        data: {
          educations: allEducation,
        },
      });
    } catch (error) {
      console.error('Error in getting education', error);
      next(error);
    }
  }

  //delete education
  deleteEducation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userId, educationId } = req.params;
      if (!userId || !educationId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please Provide the required parameters'
        );
      }

      const updatedEducation =
        await this.educationUseCase.deleteEducationById(
          userId,
          educationId
        );

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.UPDATED,
        data: {
          educations: updatedEducation,
        },
      });
    } catch (error) {
      console.error('Error in deleting education', error);
      next(error);
    }
  }

}