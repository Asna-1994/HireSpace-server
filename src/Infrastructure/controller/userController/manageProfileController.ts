import { JobSeekerProfile } from "./../../../Domain/entities/JobSeekerProfile";

import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";
import { MESSAGES } from "../../../shared/constants/messages";
import { ManageProfileUseCase } from "../../../Application/usecases/user/manageProfileUsecase";
import { CustomError } from "../../../shared/error/customError";

export class ManageJobSeekerProfileController {
  constructor(private manageProfileUseCase: ManageProfileUseCase) {}

  async addEducation(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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
      const educationId =
        typeof req.query.educationId === "string"
          ? req.query.educationId
          : undefined;

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
          "Please fill complete details",
        );
      }
      if (!userId) {
        throw new CustomError(STATUS_CODES.BAD_REQUEST, "No User Id provided");
      }

      const userData = {
        educationName,
        yearOfPassing,
        markOrGrade,
        schoolOrCollege,
        subject,
        universityOrBoard,
        userId,
        educationId,
      };

      const updatedProfile =
        await this.manageProfileUseCase.addEducation(userData);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Education added successfully",
        data: {
          updatedProfile,
        },
      });
    } catch (error) {
      console.error("Error in adding education:", error);
      next(error);
    }
  }

  //get all education
  async getAllEducation(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          "Please Provide the userId",
        );
      }

      const allEducation =
        await this.manageProfileUseCase.getAllEducation(userId);
      console.log(allEducation);
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        data: {
          educations: allEducation,
        },
      });
    } catch (error) {
      console.error("Error in getting education", error);
      next(error);
    }
  }

  //delete education
  async deleteEducation(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId, educationId } = req.params;
      if (!userId || !educationId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          "Please Provide the required parameters",
        );
      }

      const updatedEducation =
        await this.manageProfileUseCase.deleteEducationById(
          userId,
          educationId,
        );

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.UPDATED,
        data: {
          educations: updatedEducation,
        },
      });
    } catch (error) {
      console.error("Error in deleting education", error);
      next(error);
    }
  }

  //add work experience

  async addWorkExperience(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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
        typeof req.query.experienceId === "string"
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
          "Please fill complete details",
        );
      }
      if (!userId) {
        throw new CustomError(STATUS_CODES.BAD_REQUEST, "No User Id provided");
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
        await this.manageProfileUseCase.addExperience(experienceData);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Experience added successfully",
        data: {
          experience: updatedExperience, // Use the correct field name here
        },
      });
    } catch (error) {
      console.error("Error in adding experience:", error);
      next(error);
    }
  }

  //get all experience

  async getAllExperience(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          "Please Provide the userId",
        );
      }

      const allExperience =
        await this.manageProfileUseCase.getAllExperience(userId);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        data: {
          experience: allExperience,
        },
      });
    } catch (error) {
      console.error("Error in getting experience", error);
      next(error);
    }
  }

  //delete experience
  async deleteExperience(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId, experienceId } = req.params;
      if (!userId || !experienceId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          "Please Provide the required parameters",
        );
      }

      const updatedExperience =
        await this.manageProfileUseCase.deleteExperienceById(
          userId,
          experienceId,
        );

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.UPDATED,
        data: {
          experience: updatedExperience,
        },
      });
    } catch (error) {
      console.error("Error in deleting experience", error);
      next(error);
    }
  }

  //add skills

  async addSkills(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { hardSkills, softSkills, technicalSkills } = req.body;
      const { userId } = req.params;

      if (!userId) {
        throw new CustomError(STATUS_CODES.BAD_REQUEST, "No User Id provided");
      }

      const skillsData = {
        hardSkills,
        softSkills,
        technicalSkills,
        userId,
      };

      const updatedSkills =
        await this.manageProfileUseCase.addOrUpdateSkills(skillsData);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Experience added successfully",
        data: {
          skills: updatedSkills,
        },
      });
    } catch (error) {
      console.error("Error in adding experience:", error);
      next(error);
    }
  }

  //get all skills
  async getAllSkills(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          "Please Provide the userId",
        );
      }

      const allSkills = await this.manageProfileUseCase.getAllSkills(userId);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        data: {
          skills: allSkills,
        },
      });
    } catch (error) {
      console.error("Error in getting experience", error);
      next(error);
    }
  }

  //delete skill
  async deleteSkill(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const { skillName } = req.body;
      if (!userId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          "Please Provide the required parameters",
        );
      }

      const updatedSkills = await this.manageProfileUseCase.deleteSkill(
        userId,
        skillName,
      );

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.UPDATED,
        data: {
          skills: updatedSkills,
        },
      });
    } catch (error) {
      console.error("Error in deleting skills", error);
      next(error);
    }
  }

  //add certificates
  async addOrEditCertificates(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const {
        certificateTitle,
        description,
        issuer,
        issuedDate,
        certificateUrl,
      } = req.body;
      const { userId } = req.params;
      const certificateId =
        typeof req.query.certificateId === "string"
          ? req.query.certificateId
          : undefined;

      if (!certificateTitle || !issuer || !issuedDate) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          "Please fill Necessary fields",
        );
      }
      if (!userId) {
        throw new CustomError(STATUS_CODES.BAD_REQUEST, "No User Id provided");
      }

      const certificateData = {
        certificateTitle,
        description,
        issuer,
        issuedDate,
        certificateUrl,
        certificateId,
        userId,
      };

      const updatedCertificate =
        await this.manageProfileUseCase.addCertificates(certificateData);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "certificate added successfully",
        data: {
          certificate: updatedCertificate,
        },
      });
    } catch (error) {
      console.error("Error in adding certificate:", error);
      next(error);
    }
  }

  //get certificates
  async getAllCertificates(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          "Please Provide the userId",
        );
      }

      const allCertificates =
        await this.manageProfileUseCase.getAllCertificates(userId);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        data: {
          certificates: allCertificates,
        },
      });
    } catch (error) {
      console.error("Error in getting certificates", error);
      next(error);
    }
  }

  //delete certificates
  async deleteCertificate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId, certificateId } = req.params;
      if (!userId || !certificateId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          "Please Provide the required parameters",
        );
      }

      const updatedCertificate =
        await this.manageProfileUseCase.deleteCertificateById(
          userId,
          certificateId,
        );

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.UPDATED,
        data: {
          certificates: updatedCertificate,
        },
      });
    } catch (error) {
      console.error("Error in deleting certificate", error);
      next(error);
    }
  }

  //get job seeker profile
  async getJobSeekerProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          "Please Provide the userId",
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
      console.error("Error in getting profile", error);
      next(error);
    }
  }

  async saveJob(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId, jobPostId } = req.params;
      if (!userId || !jobPostId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          "Provide necessary parameters",
        );
      }
      const updatedUser = await this.manageProfileUseCase.saveJobs(
        userId,
        jobPostId,
      );
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.UPDATED,
        user: updatedUser,
      });
    } catch (err) {}
  }

  async addTagline(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const { tagline } = req.body;
      if (!userId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          "Provide necessary parameters",
        );
      }
      const updatedUser = await this.manageProfileUseCase.addTagLine(
        userId,
        tagline,
      );
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.UPDATED,
        user: updatedUser,
      });
    } catch (err) {}
  }
}
