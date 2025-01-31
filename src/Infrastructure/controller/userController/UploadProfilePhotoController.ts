import { JobSeekerProfileRepository } from "../../../Domain/repository/repo/JobSeekerProfileRepo";
import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { FileUploadUseCase } from "../../../Application/usecases/shared/fileUploadUsecase";
import { UserRepository } from "../../../Domain/repository/repo/userRepository";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";
import { MESSAGES } from "../../../shared/constants/messages";
import { CustomError } from "../../../shared/error/customError";

export class UploadProfilePhotoController {
  constructor(
    private fileUploadUseCase: FileUploadUseCase,
    private userRepository: UserRepository,
    private jobSeekerProfileRepository: JobSeekerProfileRepository
  ) {}

  async uploadProfilePicture(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
        console.log(req.file)
      if (!req.file) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.NO_UPLOAD });
        return;
      }

      
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: MESSAGES.INVALID_FILE_TYPE });
        return;
      }

      const userId = req.params.userId;
      if (!userId) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.AUTH_TOKEN_MISSING });
        return;
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ success: false, message: MESSAGES.NOT_FOUND });
        return;
      }


      const folder = "profile_pictures";
      const result = await this.fileUploadUseCase.execute(
        req.file.path,
        folder
      );

      user.profilePhoto = {
        url: result.url,
        publicId: result.publicId,
      };

      const updatedUser = await this.userRepository.update(user);

      res.status(STATUS_CODES.SUCCESS).json({
        success : true,
        message: MESSAGES.SUCCESSFULLY_UPLOADED,
        data: { user: updatedUser },
      });
    } catch (error) {
      console.error("Error in uploadProfilePicture:", error);
      next(error);
    }
  }

  //upload resume
  async uploadResume( req: Request,res: Response, next: NextFunction ): Promise<void> {
    try {
      if (!req.file) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.NO_UPLOAD,
        });
        return;
      }

      const allowedMimeTypes = ["application/pdf","application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          success: false,
          message: MESSAGES.INVALID_FILE_TYPE,
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

      const folder = "resumes";
      const result = await this.fileUploadUseCase.execute(
        req.file.path,
        folder
      );
      let jobSeekerProfile = await this.jobSeekerProfileRepository.findOne({userId : userId});
      if (!jobSeekerProfile) {
        const newProfile = {
          userId: new mongoose.Types.ObjectId(userId),
          resume: {
            url: result.url,
            publicId: result.publicId,
          },
        };
        jobSeekerProfile = await this.jobSeekerProfileRepository.create(newProfile);
      } else {
        jobSeekerProfile.resume = {
          url: result.url,
          publicId: result.publicId,
        };

        jobSeekerProfile = await this.jobSeekerProfileRepository.update(jobSeekerProfile);
      }

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.SUCCESSFULLY_UPLOADED,
        data: { jobSeekerProfile },
      });
    } catch (error) {
      console.error("Error in uploadResume:", error);
      next(error);
    }
  }

  async getResume(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        throw new CustomError(STATUS_CODES.BAD_REQUEST, "No used Id");
      }

      let jobSeekerProfile = await this.jobSeekerProfileRepository.findOne({userId : userId});
      if (!jobSeekerProfile) {
        throw new CustomError(
          STATUS_CODES.NOT_FOUND,
          "No profile found for this user"
        );
      }

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        data: { jobSeekerProfile },
      });
    } catch (error) {
      console.error("Error in getting Resume:", error);
      next(error);
    }
  }

  async deleteResume(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        throw new CustomError(STATUS_CODES.BAD_REQUEST, "No used Id");
      }

      let jobSeekerProfile = await this.jobSeekerProfileRepository.findOne({userId : userId});
      if (!jobSeekerProfile) {
        throw new CustomError(
          STATUS_CODES.NOT_FOUND,
          "No profile found for this user"
        );
      }
      if (!jobSeekerProfile.resume) {
        throw new CustomError( STATUS_CODES.NOT_FOUND,"No resume found for this user");
      }
      const { publicId } = jobSeekerProfile.resume;
      if (!publicId) {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .json({ success: false, message: "No Resume to delete" });
        return;
      }

      await this.fileUploadUseCase.deleteFile(publicId);
      jobSeekerProfile.resume = { url: "", publicId: "" };

      const updatedProfile = await this.jobSeekerProfileRepository.update(jobSeekerProfile);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Successfully Deleted",
        data: { updatedProfile },
      });
    } catch (error) {
      console.error("Error in deleting Resume:", error);
      next(error);
    }
  }

  
//delete profile image

async deleteProfilePicture(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, "No user ID provided");
    }

    let user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
    }

    if (!user.profilePhoto || !user.profilePhoto.publicId) {
      res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: "No profile picture to delete",
      });
      return;
    }

    const { publicId } = user.profilePhoto;
    await this.fileUploadUseCase.deleteFile(publicId); 

    user.profilePhoto = { url: "", publicId: "" };

    const updatedUser = await this.userRepository.update(user);

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "Profile picture deleted successfully",
      data:{ user : updatedUser},
    });
  } catch (error) {
    console.error("Error in deleting profile picture:", error);
    next(error); 
  }
}



//edit basic details

  async editBasicDetails(req: Request,res: Response,next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const {userName ,  phone , address, dateOfBirth} = req.body
      if (!userId) {
        throw new CustomError(STATUS_CODES.BAD_REQUEST, "No used Id");
      }

      let user = await this.userRepository.findById(userId)
      if (!user) {
        throw new CustomError(STATUS_CODES.NOT_FOUND,MESSAGES.NOT_FOUND);
      }
 
user.userName = userName;
user.address = address;
user.phone = phone;
user.dateOfBirth = dateOfBirth;

      const updatedUser = await this.userRepository.update(user);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Successfully Updated",
        data: { user : updatedUser },
      });
    } catch (error) {
      console.error("Error in updating user", error);
      next(error);
    }
}

}
