import mongoose, { Schema, Document } from "mongoose";

export interface SalaryRange {
  min: string;
  max: string;
  currency: string;
}

export interface Location {
  city: string;
  state: string;
  country: string;
  remote: boolean;
}

export interface JobPostDocument extends Document {
  _id: string | mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  jobTitle: string;
  description: string;
  skillsRequired: string[];
  responsibilities: string[];
  salaryRange: SalaryRange;
  location: Location;
  jobType: string;
  workMode: string;
  experienceLevel: string;
  educationRequired: string;
  postedBy: mongoose.Types.ObjectId;
  applicationDeadline: Date;
  employmentStartDate: Date;
  numberOfVacancies: number;
  benefits: string[];
  createdAt: Date;
  isDeleted: boolean;
  updatedAt: Date;
  status: string;
}

const JobPostSchema: Schema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "CompanyModel",
      required: true,
    },
    jobTitle: { type: String, required: true },
    description: { type: String, required: true },
    skillsRequired: { type: [String], required: true },
    responsibilities: { type: [String], required: true },
    salaryRange: {
      min: { type: String, required: true },
      max: { type: String, required: true },
      currency: { type: String, required: true },
    },
    isDeleted: { type: Boolean, required: true, default: false },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      remote: { type: Boolean, default: false },
    },
    jobType: { type: String, required: true },
    workMode: { type: String, required: true },
    experienceLevel: { type: String, required: true },
    educationRequired: { type: String, required: true },
    postedBy: { type: Schema.Types.ObjectId, ref: "UserModel", required: true },
    applicationDeadline: { type: Date, required: true },
    employmentStartDate: { type: Date },
    numberOfVacancies: { type: Number, required: true },
    benefits: { type: [String] },
    status: {
      type: String,
      enum: ["Active", "Closed", "Draft"],
      default: "Active",
    },
  },
  { timestamps: true },
);

export const JobPostModel = mongoose.model<JobPostDocument>(
  "JobPostModel",
  JobPostSchema,
);
