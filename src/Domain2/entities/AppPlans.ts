import mongoose from 'mongoose';


export interface IPlans {
  _id?: mongoose.Types.ObjectId;
  planType: string;
  price: number;
  userType: 'user' | 'company';
  durationInDays: number;
  features: string[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;


}


