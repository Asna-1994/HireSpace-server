import mongoose from "mongoose";
import { CustomError } from "../../shared/error/customError";
import { STATUS_CODES } from "../../shared/constants/statusCodes";

export class Subscriptions {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  paymentId: mongoose.Types.ObjectId;
  isActive: boolean;
  paymentStatus: "success" | "pending" | "failed";
  transactionId: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<Subscriptions>) {
    this._id = data._id!;
    this.userId = data.userId!;
    this.planId = data.planId!;
    this.startDate = data.startDate!;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.paymentId = data.paymentId!;
    this.endDate = data.endDate!;
    this.transactionId = data.transactionId!;
    this.paymentStatus = data.paymentStatus || "pending";
    this.isActive = data.isActive || false;
  }
}

export const normalizeSubscriptions = (data: any): Subscriptions => {
  // console.log('Received subs data:', data);
  if (!data || !data._id) {
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      "Invalid data or missing _id",
    );
  }

  return {
    ...data,
    _id: data._id.toString(),
    userId: data.userId.toString(),
    planId: data.planId.toString(),
    paymentId: data.paymentId.toString(),
  };
};
