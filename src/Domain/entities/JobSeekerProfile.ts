import mongoose, { ObjectId } from "mongoose";
import { CustomError } from "../../shared/error/customError";
import { STATUS_CODES } from "../../shared/constants/statusCodes";
import { imageObject } from "./Company";

export interface EducationObject {
  educationName: string;
  yearOfPassing: string;
  markOrGrade: string;
  schoolOrCollage: string;
  subject: string;
  universityOrBoard: string;
  _id: mongoose.Types.ObjectId;
}

export interface ExperienceObject {
  company: string;
  designation: string;
  yearCompleted: string;
  dateFrom: string;
  dateTo: string;
  skillsGained: string[];
  createAt: Date;
  updatedAt: Date;
  _id: mongoose.Types.ObjectId;
}

export interface Certificates {
  certificateTitle: string;
  description?: string;
  certificateUrl?: string;
  issuer: string;
  issuedDate: string;
  createAt: Date;
  updatedAt: Date;
  _id: mongoose.Types.ObjectId;
}

export interface Skills {
  softSkills?: [];
  hardSkills?: [];
  technicalSkills?: [];
  createAt?: Date;
  updatedAt?: Date;
  _id?: mongoose.Types.ObjectId;
}

export class JobSeekerProfile {
  userId: mongoose.Types.ObjectId;
  _id?: string;
  education?: EducationObject[];
  workExperience?: ExperienceObject[];
  certificates?: Certificates[];
  skills?: Skills;
  resume?: imageObject;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<JobSeekerProfile>) {
    this._id = data._id!;
    this.education = data.education || [];
    this.createdAt = data.createdAt!;
    this.updatedAt = data.updatedAt!;
    this.userId = data.userId!;
    this.resume = data.resume;
    this.workExperience = data.workExperience || [];
    this.certificates = data.certificates || [];
    this.skills = data.skills || {};
  }
}

export const normalizeJobSeekerProfile = (data: any): JobSeekerProfile => {
  // console.log('Received company data:', data);
  if (!data || !data._id) {
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      "Invalid data or missing _id",
    );
  }

  return {
    ...data,
    _id: data._id.toString(),
  };
};
