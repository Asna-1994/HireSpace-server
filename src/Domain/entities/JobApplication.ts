import mongoose, { Types } from "mongoose";
import { CoverLetter } from "../../Infrastructure/models/JobApplicationModel";
import { CustomError } from "../../shared/error/customError";
import { STATUS_CODES } from "../../shared/constants/statusCodes";



export class JobApplication {
  _id: string |mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId  | string;
  jobPostId: mongoose.Types.ObjectId  | string;
  companyId :  mongoose.Types.ObjectId  | string;
  coverLetter: CoverLetter;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  appliedDate: Date;
  updatedDate: Date;
  resumeUrl: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: JobApplication) {
    if (!data._id || !data.userId || !data.jobPostId || !data.companyId) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
        "Missing required fields (_id, userId, jobPostId, companyId)"
      );
    }
    this._id = data._id!;
    this.userId = data.userId!;
    this.companyId = data.companyId!;
    this.jobPostId = data.jobPostId!;
    this.coverLetter = data.coverLetter!;
    this.status = data.status || "pending";
    this.appliedDate = data.appliedDate || new Date();
    this.updatedDate = data.updatedDate || new Date();
    this.resumeUrl = data.resumeUrl!;
    this.isDeleted = data.isDeleted || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // updateStatus(newStatus: "pending" | "reviewed" | "accepted" | "rejected"): void {
  //   this.status = newStatus;
  //   this.updatedDate = new Date();
  // }

  // markDeleted(): void {
  //   this.isDeleted = true;
  //   this.updatedDate = new Date();
  // }


}


export const normalizeJobApplication = (data: any): JobApplication => {
  try{
    // console.log("data , revieved,", data)
    if (!data || !data.companyId || !data._id || !data.userId || data.jobPostId) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST,"Invalid data: missing required fields.");
    }
  
    return {
      ...data,
      companyId: data.companyId.toString(),
      userId: data.userId.toString(),
      jobPostId: data.jobPostId.toString(),
      _id : data._id.toString()
    };
  }
  catch(err){
throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, "failed to return data from normalize function")
  }

};

  
  