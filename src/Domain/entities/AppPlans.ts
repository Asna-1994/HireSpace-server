import mongoose from "mongoose";
import { CustomError } from "../../shared/error/customError";
import { STATUS_CODES } from "../../shared/constants/statusCodes";

export class Plans {
  _id?: mongoose.Types.ObjectId;
  planType: string;
  price: number;
  userType: "user" | "company";
  durationInDays: number;
  features: string[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<Plans>) {
    this.planType = data.planType!;
    this.price = data.price || 0!;
    this.userType = data.userType || "user";
    this.durationInDays = data.durationInDays!;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.isDeleted = data.isDeleted || false;
    this.features = data.features || [];
    this._id = data._id;
  }
}

export const normalizePlans = (data: any): Plans => {
  //   console.log('Received plan data:', data);
  if (!data || !data._id) {
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      "Invalid data or missing _id",
    );
  }

  return {
    ...data,
    _id: data._id.toString(),
  };
};
