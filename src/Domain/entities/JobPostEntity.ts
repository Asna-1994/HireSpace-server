import mongoose from "mongoose";
import {
  SalaryRange,
  Location,
} from "../../Infrastructure/models/JobPostModel";
import { CustomError } from "../../shared/error/customError";
import { STATUS_CODES } from "../../shared/constants/statusCodes";

export class JobPost {
  companyId: mongoose.Types.ObjectId;
  jobTitle: string;
  _id: string | mongoose.Types.ObjectId;
  description: string;
  skillsRequired: string[];
  responsibilities: string[];
  salaryRange: SalaryRange;
  location: Location;
  jobType: string;
  workMode: string;
  isDeleted: boolean;
  experienceLevel: string;
  educationRequired: string;
  postedBy: mongoose.Types.ObjectId;
  applicationDeadline: Date;
  employmentStartDate: Date;
  numberOfVacancies: number;
  benefits: string[];
  createdAt: Date;
  updatedAt: Date;
  status: string;

  constructor(data: Partial<JobPost>) {
    this.companyId = new mongoose.Types.ObjectId(data.companyId);
    this.jobTitle = data.jobTitle!;
    this._id = data._id!;
    this.description = data.description!;
    this.skillsRequired = data.skillsRequired || [];
    this.responsibilities = data.responsibilities || [];
    this.salaryRange = data.salaryRange!;
    this.location = data.location!;
    this.workMode = data.workMode!;
    this.jobType = data.jobType!;
    this.isDeleted = data.isDeleted!;
    this.experienceLevel = data.experienceLevel!;
    this.educationRequired = data.educationRequired!;
    this.postedBy = new mongoose.Types.ObjectId(data.postedBy);
    this.applicationDeadline = data.applicationDeadline!;
    this.employmentStartDate = data.employmentStartDate!;
    this.numberOfVacancies = data.numberOfVacancies || 1;
    this.benefits = data.benefits || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.status = data.status || "Active";
  }

  updateStatus(newStatus: string): void {
    this.status = newStatus;
  }

  extendApplicationDeadline(newDeadline: Date): void {
    this.applicationDeadline = newDeadline;
  }

  validateFields(): void {
    if (!this.jobTitle || !this.description) {
      throw new Error("Job title and description are required.");
    }
    if (this.salaryRange.min > this.salaryRange.max) {
      throw new Error(
        "Invalid salary range: minimum cannot be greater than maximum.",
      );
    }
  }
}

export const normalizeJobPost = (data: any): JobPost => {
  if (!data || !data.companyId || !data.postedBy) {
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      "Invalid data: missing required fields.",
    );
  }

  return {
    ...data,
    companyId: data.companyId.toString(),
    postedBy: data.postedBy.toString(),
  };
};
