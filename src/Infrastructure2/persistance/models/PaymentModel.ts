import { model, Schema } from "mongoose";import { IPayment } from "../../../Domain2/entities/Payment";
const paymentSchema: Schema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    planId: { type: Schema.Types.ObjectId, ref: 'PlanModel', required: true },
    paymentDate: { type: Date, required: true },
    amountPaid: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['success', 'pending', 'failed'],
      required: true,
    },
    transactionId: { type: String, required: true },
    paymentMethod: { type: String, required: true },
  },
  { timestamps: true }
);

export const PaymentModel = model<IPayment>(
  'PaymentModel',
  paymentSchema
);
