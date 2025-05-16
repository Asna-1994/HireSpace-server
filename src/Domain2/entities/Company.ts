import mongoose from 'mongoose';


export interface imageObject {
  url: string;
  publicId: string;
}

export interface Member {
  userId: mongoose.Types.ObjectId | string;
  role: 'companyMember' | 'companyAdmin';
  _id?: mongoose.Types.ObjectId | string;
}

export interface ICompany {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  establishedDate: Date;
  refreshTokens: String [];
  industry: string;
  verificationDocument?: imageObject;
  documentNumber?: string;
  entity: 'company' | 'user';
  password: string;
  _id: mongoose.Types.ObjectId;
  companyLogo?: imageObject;
  appPlan: 'basic' | 'premium';
  isBlocked: boolean;
  isPremium: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  isSpam: boolean;
  members: Member[];
  createdAt: Date;
  updatedAt: Date;
  

}

 
