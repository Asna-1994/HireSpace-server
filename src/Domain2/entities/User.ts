import mongoose from "mongoose";

export interface imageObject {
  url: string;
  publicId: string;
}

export interface User {
  userName?: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  tagLine?: string;
  entity: 'company' | 'user';
  userRole?: 'jobSeeker' | 'companyAdmin' | 'companyMember' | 'admin';
  password?: string;
  _id: mongoose.Types.ObjectId;
  profilePhoto?: imageObject;
  googleId?: string;
  refreshTokens  : string[];
  appPlan: {
    planType: string;
    startDate: Date | null;
    endDate: Date | null;
    subscriptionId: mongoose.Types.ObjectId | null;
  };
  isBlocked: boolean;
  isPremium: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  isFresher: boolean;
  isSpam: boolean;
  companyId?: mongoose.Types.ObjectId;
  connections: mongoose.Types.ObjectId[];
  savedJobs: mongoose.Types.ObjectId[];
  appliedJobs: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;

}