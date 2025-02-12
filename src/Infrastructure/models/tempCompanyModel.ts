import mongoose, { Document, Schema, model } from "mongoose";

export interface TempCompanyDocument extends Document {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  establishedDate: Date;
  industry: string;
  password: string;
  otp: string;
  otpExpiry: Date;
  companyAdminEmail: string;
  validateEmail: () => void;
}

const tempCompanySchema = new Schema<TempCompanyDocument>({
  companyName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  establishedDate: { type: Date, required: true },
  industry: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true },
  companyAdminEmail: { type: String, required: true },
});

export const TempCompanyModel = model<TempCompanyDocument>(
  "TempCompanyModel",
  tempCompanySchema,
);
