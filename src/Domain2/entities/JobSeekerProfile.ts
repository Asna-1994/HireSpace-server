import mongoose from 'mongoose';
import { imageObject } from './Company';

export interface EducationObject {
  educationName: string;
  yearOfPassing: string;
  markOrGrade: string;
schoolOrCollege: string;
  subject: string;
  universityOrBoard: string;
  _id:mongoose.Types.ObjectId ;

}

export interface ExperienceObject {
  company: string;
  designation: string;
  yearCompleted: string;
  dateFrom: string;
  dateTo: string;
  skillsGained: string[];
  _id:mongoose.Types.ObjectId ;
}

export interface Certificates {
  certificateTitle: string;
  description?: string;
  certificateUrl?: string;
  issuer: string;
  issuedDate: string;
  _id:mongoose.Types.ObjectId ;
}

// export interface Skills {
//   softSkills?: [];
//   hardSkills?: [];
//   technicalSkills?: [];
//   createAt?: Date;
//   updatedAt?: Date;
//   _id?:mongoose.Types.ObjectId ;
// }
export interface Skills {
  softSkills?: string[];
  hardSkills?: string[];
  technicalSkills?: string[];
}

export interface IJobSeekerProfile {
  userId:mongoose.Types.ObjectId ;
  _id:mongoose.Types.ObjectId ;
  education?: EducationObject[];
  workExperience?: ExperienceObject[];
  certificates?: Certificates[];
  skills?: Skills;
  resume?: imageObject;
  createdAt?: Date;
  updatedAt?: Date;

}


