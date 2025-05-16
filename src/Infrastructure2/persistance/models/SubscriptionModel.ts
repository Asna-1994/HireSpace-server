import { model, Schema } from "mongoose";import { ISubscriptions } from "../../../Domain2/entities/Subscription";
const subscriptionSchema: Schema = new Schema<ISubscriptions>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    planId: { type: Schema.Types.ObjectId, ref: 'PlanModel', required: true },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'PaymentModel',
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true }, 
    paymentStatus: {
      type: String,
      enum: ['success', 'pending', 'failed'],
      required: true,
    },
    transactionId: { type: String, required: true },
  },
  { timestamps: true }
);

export const SubscriptionModel = model<ISubscriptions>(
  'SubscriptionModel',
  subscriptionSchema
);