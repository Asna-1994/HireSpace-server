import mongoose, { Document, Schema, model } from 'mongoose';

export interface PlanDocument extends Document {
  planType: string;
  price: number;
  userType: 'user' | 'company';
  durationInDays: number;
  features: string[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const planSchema: Schema = new Schema<PlanDocument>(
  {
    planType: { type: String, required: true },
    price: { type: Number, required: true },
    userType: {
      type: String,
      enum: ['user', 'company'],
      default: 'user',
      required: true,
    },
    durationInDays: { type: Number, required: true },
    features: { type: [String], required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PlanModel = model<PlanDocument>('PlanModel', planSchema);
