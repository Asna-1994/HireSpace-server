import mongoose from 'mongoose';


export interface ICompanyProfile {
  companyId:mongoose.Types.ObjectId;
  _id:mongoose.Types.ObjectId;
  mission?: string;
  vision?: string;
  founder?: string;
  ceo?: string;
  description?: string;
  aboutUs?: string;
  website?: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;

}


