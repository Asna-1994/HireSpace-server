import { model, Schema } from "mongoose";
import { ICompanyProfile } from "../../../Domain2/entities/CompanyProfile";
const companyProfileSchema = new Schema<ICompanyProfile>(
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

export const CompanyProfileModel = model<ICompanyProfile>(
  'CompanyProfileModel',
  companyProfileSchema
);
