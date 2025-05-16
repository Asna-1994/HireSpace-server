


import { imageObject } from "../../../Domain2/entities/User";



export interface SkillsDTO {
  softSkills?: string[];
  hardSkills?: string[];
  technicalSkills?: string[];
}

export interface EducationDTO {
  educationName: string;
  yearOfPassing: string;
  markOrGrade: string;
  schoolOrCollege: string;
  subject: string;
  universityOrBoard: string;
  _id: string;
}
export interface AddEducationDTO {
    educationName: string;
    yearOfPassing: string;
    markOrGrade: string;
    schoolOrCollege: string;
    subject: string;
    universityOrBoard: string;
    userId: string;
    educationId?: string;
}


export interface ExperienceDTO {
  company: string;
  designation: string;
  yearCompleted: string;
  dateFrom: string;
  dateTo: string;
  skillsGained: string[];
  _id: string;
}

export interface CertificatesDTO {
  certificateTitle: string;
  description?: string;
  certificateUrl?: string;
  issuer: string;
  issuedDate: string;
  _id: string;
}

export interface IJobSeekerProfileDTO {
  userId: string;
  _id: string;
  education?: EducationDTO[];
  workExperience?: ExperienceDTO[];
  certificates?: CertificatesDTO[];
  skills?: SkillsDTO;
  resume?: imageObject;
  createdAt?: string;
  updatedAt?:string;
}
