import mongoose, { Document, Schema, model } from "mongoose";

export interface SpamDocument extends Document {
  reportedByUser: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  isDeleted: boolean;
  reason: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const spamSchema: Schema = new Schema<SpamDocument>(
  {
    reportedByUser: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "CompanyModel",
      required: true,
    },
    reason: { type: String, required: true },
    description: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const SpamModel = model<SpamDocument>("SpamModel", spamSchema);
