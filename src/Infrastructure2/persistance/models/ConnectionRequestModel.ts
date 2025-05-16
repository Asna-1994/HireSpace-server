import mongoose, { model, Schema } from "mongoose"
import { IConnectionRequest } from "../../../Domain2/entities/UserConnections";

const ConnectionRequestSchema = new Schema<IConnectionRequest>(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const ConnectionRequestModel = model<IConnectionRequest>(
  'ConnectionRequestModel',
  ConnectionRequestSchema
);
