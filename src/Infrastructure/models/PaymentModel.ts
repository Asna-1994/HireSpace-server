import mongoose, { Document, Schema, model } from "mongoose";

export interface PaymentDocument extends Document {
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  amountPaid: number;
  paymentDate: Date;
  paymentMethod: string;
  paymentStatus: "success" | "pending" | "failed";
  transactionId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const paymentSchema: Schema = new Schema<PaymentDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "UserModel", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "PlanModel", required: true },
    paymentDate: { type: Date, required: true },
    amountPaid: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["success", "pending", "failed"],
      required: true,
    },
    transactionId: { type: String, required: true },
    paymentMethod: { type: String, required: true },
  },
  { timestamps: true },
);

export const PaymentModel = model<PaymentDocument>(
  "PaymentModel",
  paymentSchema,
);
