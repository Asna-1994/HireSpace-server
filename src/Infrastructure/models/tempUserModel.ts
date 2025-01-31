
import { Document, Schema, model } from 'mongoose';


export interface TempUserDocument extends Document {
  userName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: Date;
  userRole: string;
  password: string;
  otp: string;
  otpExpiry: Date;

  validateEmail: () => void;
}


const tempUserSchema = new Schema<TempUserDocument>({
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


export const TempUserModel = model<TempUserDocument>('TempUserModel', tempUserSchema);
