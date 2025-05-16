
import { Request, Response, NextFunction } from 'express';

import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { CustomError } from '../../../shared/error/customError';
import { UploadUseCase } from '../../../Application2/usecases/user/UploadUseCase';

export class UploadController {
  constructor(
  private uploadUseCase : UploadUseCase
  ) {}

   uploadProfilePicture  =  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log(req.file);
         const userId = req.params.userId;
      if (!req.file) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.NO_UPLOAD });
        return;
      }

      const updatedUser =await this.uploadUseCase.uploadProfile(userId, req.file)

console.log('user after profile upload' , updatedUser)
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.SUCCESSFULLY_UPLOADED,
        data: { user: updatedUser },
      });
    } catch (error) {
      console.error('Error in uploadProfilePicture:', error);
      next(error);
    }
  }

  //upload resume
 uploadResume =  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) =>  {
    try {
      if (!req.file) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.NO_UPLOAD,
        });
        return;
      }
 const userId = req.params.userId;
   if (!userId) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: MESSAGES.AUTH_TOKEN_MISSING,
        });
        return;
      }
      const JobSeekerProfile = await this.uploadUseCase.uploadResume(userId,req.file)
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.SUCCESSFULLY_UPLOADED,
        data: { JobSeekerProfile },
      });
    } catch (error) {
      console.error('Error in uploadResume:', error);
      next(error);
    }
  }


 deleteResume = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) =>  {
    try {
      const { userId } = req.params;

      if (!userId) {
        throw new CustomError(STATUS_CODES.BAD_REQUEST, 'No used Id');
      }

      const updatedProfile =await  this.uploadUseCase.deleteResume(userId)



      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: 'Successfully Deleted',
        data: { updatedProfile },
      });
    } catch (error) {
      console.error('Error in deleting Resume:', error);
      next(error);
    }
  }

  //delete profile image

  deleteProfilePicture = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) =>{
    try {
      const { userId } = req.params;

      if (!userId) {
        throw new CustomError(STATUS_CODES.BAD_REQUEST, 'No user ID provided');
      }

      const updatedUser = await this.uploadUseCase.deleteProfilePicture(userId)
      console.log('user after profilephoto deleted',updatedUser)
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: 'Profile picture deleted successfully',
        data: { user: updatedUser },
      });
    } catch (error) {
      console.error('Error in deleting profile picture:', error);
      next(error);
    }
  }

}
