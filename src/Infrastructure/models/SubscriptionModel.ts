import mongoose, { Document, Schema, model } from 'mongoose';

export interface SubscriptionDocument extends Document {
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  paymentStatus: 'success' | 'pending' | 'failed';
  transactionId: string;
  paymentId : mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const subscriptionSchema: Schema = new Schema<SubscriptionDocument>({
  userId: { type: Schema.Types.ObjectId, ref: "UserModel", required: true },
  planId: { type: Schema.Types.ObjectId, ref: "PlanModel", required: true },
  paymentId: { type: Schema.Types.ObjectId, ref: "PaymentModel", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }, 
  isActive: { type: Boolean, default: true }, // Assuming active by default
  paymentStatus: { type: String, enum: ['success', 'pending', 'failed'], required: true },
  transactionId: { type: String, required: true }, 
}, { timestamps: true }); 

export const SubscriptionModel = model<SubscriptionDocument>('SubscriptionModel', subscriptionSchema);