import { model, Schema } from "mongoose";
import { ITempUser } from "../../../Domain2/entities/TempUser";

const tempUserSchema = new Schema<ITempUser>({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  userRole: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true },
});

export const TempUserModel = model<ITempUser>(
  'TempUserModel',
  tempUserSchema
);
