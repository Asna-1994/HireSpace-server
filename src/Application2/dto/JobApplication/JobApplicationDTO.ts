import { imageObject } from "../../../Domain2/entities/Company";
import { IJobPostDTO } from '../JobPost/JobPostDTO';




 interface IUserDTO {
  _id: string;
  userName: string;
  email: string;
  phone: string;
  address: string;
  profilePhoto: imageObject; 
}


export interface IJobApplicationDTO {
  _id: string;
  userId: IUserDTO;
  jobPostId: IJobPostDTO;
  companyId : string;
  coverLetter: {
    salutation: string;
    body: string;
    closing: string;
  };
  resumeUrl: string;
  status: "pending" | "reviewed" | "accepted" | "rejected"
  appliedDate: Date;
  updatedDate: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

