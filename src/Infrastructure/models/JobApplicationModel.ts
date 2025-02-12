import mongoose, { Schema, Document } from "mongoose";

export interface CoverLetter {
  salutation: string;
  body: string;
  closing: string;
}

export interface JobApplicationDocument extends Document {
  _id: string | mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | string;
  companyId: mongoose.Types.ObjectId | string;
  jobPostId: mongoose.Types.ObjectId | string;
  coverLetter: CoverLetter;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  appliedDate: Date;
  updatedDate: Date;
  resumeUrl: string;
  createdAt: Date;
  isDeleted: boolean;
  updatedAt: Date;
}

const JobApplicationSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "UserModel", required: true },
    companyId: {
      type: mongoose.Types.ObjectId,
      ref: "CompanyModel",
      required: true,
    },
    jobPostId: {
      type: mongoose.Types.ObjectId,
      ref: "JobPostModel",
      required: true,
    },
    coverLetter: {
      salutation: { type: String },
      body: { type: String },
      closing: { type: String },
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
    },
    appliedDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, required: true, default: false },
    resumeUrl: { type: String },
  },
  { timestamps: true },
);

export const JobApplicationModel = mongoose.model<JobApplicationDocument>(
  "JobApplicationModel",
  JobApplicationSchema,
);
