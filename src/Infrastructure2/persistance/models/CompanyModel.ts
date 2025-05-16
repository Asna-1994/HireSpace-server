import { model, Schema } from "mongoose";
import { ICompany } from "../../../Domain2/entities/Company";

const companySchema = new Schema<ICompany>(
  {
    companyName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    entity: { type: String, enum: ['company', 'user'], default: 'company' },
    password: { type: String },
    address: { type: String },
    refreshTokens: {
      type: [String], 
      default: []
    }, 
    companyLogo: {
      type: {
        url: { type: String },
        publicId: { type: String },
      },
      default: { url: '', publicId: '' },
    },
    establishedDate: { type: Date },
    verificationDocument: {
      type: {
        url: { type: String },
        publicId: { type: String },
      },
      default: { url: '', publicId: '' },
    },
    documentNumber: { type: String },
    industry: { type: String, required: true },
    appPlan: {
      type: String,
      enum: ['basic', 'premium'],
      default: 'basic',
    },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isSpam: { type: Boolean, default: false },
    members: [
      {
        role: {
          type: String,
          enum: ['companyAdmin', 'companyMember'],
          default: 'companyMember',
        },
        userId: { type: Schema.Types.ObjectId, ref: 'UserModel' },
      },
    ],
  },
  { timestamps: true }
);



export const CompanyModel = model<ICompany>(
  'CompanyModel',
  companySchema
);