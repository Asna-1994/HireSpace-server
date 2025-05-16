import mongoose from 'mongoose';


export interface ISpamReport {
  _id: mongoose.Types.ObjectId;
  reportedByUser: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  isDeleted: boolean;
  reason: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;

}


