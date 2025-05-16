import mongoose from "mongoose";
import {  EducationDTO, ExperienceDTO, IJobSeekerProfileDTO,CertificatesDTO } from "../../../Application2/dto/JobSeekerProfile/JobSeekerProfileDTO";
import { IJobSeekerProfile } from "../../../Domain2/entities/JobSeekerProfile";






export const normalizeJobSeekerProfile = (entity: IJobSeekerProfile): IJobSeekerProfileDTO => {

  try{
 return {
    userId: entity.userId?.toString() || '',
    _id: entity._id?.toString() || "",
    createdAt: entity.createdAt?.toISOString(),
    updatedAt: entity.updatedAt?.toISOString(),
    resume: entity.resume,

    education: entity.education?.map((edu): EducationDTO => ({
      _id: edu._id?.toString() || '',
      educationName: edu.educationName,
      yearOfPassing: edu.yearOfPassing,
      markOrGrade: edu.markOrGrade,
      schoolOrCollege: edu.schoolOrCollege,
      subject: edu.subject,
      universityOrBoard: edu.universityOrBoard,

    })),

    workExperience: entity.workExperience?.map((exp): ExperienceDTO => ({
      _id: exp._id?.toString() || '',
      company: exp.company,
      designation: exp.designation,
      yearCompleted: exp.yearCompleted,
      dateFrom: exp.dateFrom,
      dateTo: exp.dateTo,
      skillsGained: exp.skillsGained,

    })),

    certificates: entity.certificates?.map((cert): CertificatesDTO => ({
      _id: cert._id?.toString() || '',
      certificateTitle: cert.certificateTitle,
      description: cert.description,
      certificateUrl: cert.certificateUrl,
      issuer: cert.issuer,
      issuedDate: cert.issuedDate,

    })),

    skills : entity.skills
      ? {
          softSkills: entity.skills.softSkills,
          hardSkills: entity.skills.hardSkills,
          technicalSkills: entity.skills.technicalSkills,
        }
      : undefined,
  };
  }catch(err){
        console.error("Error normalizing JobSeekerProfile:", err);
    throw new Error("Normalization failed");
  }
 
};



export const denormalizeJobSeekerProfile = (dto: IJobSeekerProfileDTO): IJobSeekerProfile => {
  return {
    userId: new mongoose.Types.ObjectId(dto.userId),
    _id:  new mongoose.Types.ObjectId(dto._id),
    resume: dto.resume,
    education: dto.education?.map((edu) => ({
      _id: new mongoose.Types.ObjectId(edu._id),
      educationName: edu.educationName,
      yearOfPassing: edu.yearOfPassing,
      markOrGrade: edu.markOrGrade,
      schoolOrCollege: edu.schoolOrCollege,
      subject: edu.subject,
      universityOrBoard: edu.universityOrBoard,

    })),

    workExperience: dto.workExperience?.map((exp) => ({
      _id: new mongoose.Types.ObjectId(exp._id),
      company: exp.company,
      designation: exp.designation,
      yearCompleted: exp.yearCompleted,
      dateFrom: exp.dateFrom,
      dateTo: exp.dateTo,
      skillsGained: exp.skillsGained,

    })),

    certificates: dto.certificates?.map((cert) => ({
      _id: new mongoose.Types.ObjectId(cert._id),
      certificateTitle: cert.certificateTitle,
      description: cert.description,
      certificateUrl: cert.certificateUrl,
      issuer: cert.issuer,
      issuedDate: cert.issuedDate,

    })),

    skills: dto.skills
      ? {
          softSkills: dto.skills.softSkills,
          hardSkills: dto.skills.hardSkills,
          technicalSkills: dto.skills.technicalSkills,
      
        }
      : undefined,
  };
};
