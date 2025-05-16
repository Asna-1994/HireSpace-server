import mongoose from 'mongoose';


export interface IPayment {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  amountPaid: number;
  paymentDate: Date;
  paymentMethod: string;
  paymentStatus: 'success' | 'pending' | 'failed';
  transactionId: string;
  createdAt?: Date;
  updatedAt?: Date;

}



