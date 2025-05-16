import mongoose from 'mongoose';


export interface ISubscriptions {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  paymentId: mongoose.Types.ObjectId;
  isActive: boolean;
  paymentStatus: 'success' | 'pending' | 'failed';
  transactionId: string;
  createdAt?: Date;
  updatedAt?: Date;


}


