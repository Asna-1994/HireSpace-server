import mongoose, { Schema, Document } from 'mongoose';

export interface CompanyProfileDocument extends Document {
  companyId: mongoose.Types.ObjectId;
  mission?: string;
  vision?: string;
  founder?: string;
  ceo?: string;
  website?: string;
  description?: string;
  aboutUs?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const companyProfileSchema = new Schema<CompanyProfileDocument>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'CompanyModel',
      required: true,
      index: true,
    },
    mission: { type: String },
    vision: { type: String },
    founder: { type: String },
    ceo: { type: String },
    website: { type: String },
    description: { type: String },
    aboutUs: { type: String },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      twitter: { type: String },
      linkedin: { type: String },
    },
  },
  { timestamps: true }
);

export const CompanyProfileModel = mongoose.model<CompanyProfileDocument>('CompanyProfileModel', companyProfileSchema);
