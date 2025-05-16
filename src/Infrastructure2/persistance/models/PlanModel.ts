import { model, Schema } from "mongoose";import { IPlans } from "../../../Domain2/entities/AppPlans";
const planSchema: Schema = new Schema<IPlans>(
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

export const PlanModel = model<IPlans>('PlanModel', planSchema);
