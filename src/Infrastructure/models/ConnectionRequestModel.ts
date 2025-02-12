import mongoose, { Document, Schema, model } from "mongoose";

export interface ConnectionRequestDocument extends Document {
  fromUser: mongoose.Types.ObjectId;
  toUser: mongoose.Types.ObjectId;
  status: "accepted" | "rejected" | "pending";
}

const ConnectionRequestSchema = new Schema<ConnectionRequestDocument>(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const ConnectionRequestModel = mongoose.model<ConnectionRequestDocument>(
  "ConnectionRequestModel",
  ConnectionRequestSchema,
);
