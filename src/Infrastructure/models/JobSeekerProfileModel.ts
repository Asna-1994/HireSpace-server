import mongoose, { Document, Schema, model } from 'mongoose';
import {
  Certificates,
  EducationObject,
  ExperienceObject,
  Skills,
} from '../../Domain/entities/JobSeekerProfile';
import { imageObject } from '../../Domain/entities/Company';

export interface JobSeekerProfileDocument extends Document {
  userId: mongoose.Types.ObjectId;
  education?: EducationObject[];
  workExperience?: ExperienceObject[];
  certificates?: Certificates[];
  skills?: Skills;
  resume?: imageObject;
  createdAt?: Date;
  updatedAt?: Date;
}

const jobSeekerProfileSchema = new Schema<JobSeekerProfileDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'UserModel',
      required: true,
      index: true,
    },
    resume: {
      type: {
        url: { type: String },
        publicId: { type: String },
      },
      default: {},
    },
    education: [
      {
        educationName: { type: String, required: true },
        yearOfPassing: { type: String, required: true },
        markOrGrade: { type: String, required: true },
        schoolOrCollege: { type: String, required: true },
        subject: { type: String, required: true },
        universityOrBoard: { type: String, required: true },
      },
    ],
    workExperience: [
      {
        company: { type: String, required: true },
        designation: { type: String, required: true },
        yearCompleted: { type: String, required: true },
        dateFrom: { type: String, required: true },
        dateTo: { type: String, required: true },
        skillsGained: { type: [String] },
        createdAt: { type: Date, required: true },
        updatedAt: { type: Date, required: true },
      },
    ],
    certificates: [
      {
        certificateTitle: { type: String, required: true },
        description: { type: String },
        certificateUrl: { type: String },
        issuer: { type: String, required: true },
        issuedDate: { type: String, required: true },
        createdAt: { type: Date, required: true },
        updatedAt: { type: Date, required: true },
      },
    ],
    skills: {
      softSkills: { type: [String] },
      hardSkills: { type: [String] },
      technicalSkills: { type: [String] },
      createdAt: { type: Date },
      updatedAt: { type: Date },
    },
  },
  { timestamps: true }
);

export const JobSeekerProfileModel = model<JobSeekerProfileDocument>(
  'JobSeekerProfileModel',
  jobSeekerProfileSchema
);
