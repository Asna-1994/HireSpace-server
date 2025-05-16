import mongoose, { model, Schema } from "mongoose";
import { IJobApplication } from "../../../Domain2/entities/JobApplication";

const JobApplicationSchema: Schema = new Schema<IJobApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'CompanyModel',
      required: true,
    },
    jobPostId: {
      type: Schema.Types.ObjectId,
      ref: 'JobPostModel',
      required: true,
    },
    coverLetter: {
      salutation: { type: String },
      body: { type: String },
      closing: { type: String },
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'accepted', 'rejected'],
      default: 'pending',
    },
    appliedDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, required: true, default: false },
    resumeUrl: { type: String },
  },
  { timestamps: true }
);

export const JobApplicationModel = model<IJobApplication>(
  'JobApplicationModel',
  JobApplicationSchema
);
