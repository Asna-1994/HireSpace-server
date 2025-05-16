import { model, Schema } from "mongoose";
import { IJobSeekerProfile } from "../../../Domain2/entities/JobSeekerProfile";
const jobSeekerProfileSchema = new Schema<IJobSeekerProfile>(
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
     
      },
    ],
    certificates: [
      {
        certificateTitle: { type: String, required: true },
        description: { type: String },
        certificateUrl: { type: String },
        issuer: { type: String, required: true },
        issuedDate: { type: String, required: true },
 
      },
    ],
    skills: {
      softSkills: { type: [String] },
      hardSkills: { type: [String] },
      technicalSkills: { type: [String] },
    },
  },
  { timestamps: true }
);

export const JobSeekerProfileModel = model<IJobSeekerProfile>(
  'JobSeekerProfileModel',
  jobSeekerProfileSchema
);
