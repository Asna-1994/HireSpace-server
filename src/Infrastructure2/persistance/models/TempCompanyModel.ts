import { ITempCompany } from "../../../Domain2/entities/TempCompany";
import { model, Schema } from "mongoose";

const tempCompanySchema = new Schema<ITempCompany>({
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

export const TempCompanyModel = model<ITempCompany>(
  'TempCompanyModel',
  tempCompanySchema
);