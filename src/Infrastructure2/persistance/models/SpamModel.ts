import { model, Schema } from "mongoose";import { ISpamReport } from "../../../Domain2/entities/SpamReports";
const spamSchema: Schema = new Schema<ISpamReport>(
  {
    reportedByUser: {
      type: Schema.Types.ObjectId,
      ref: 'UserModel',
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'CompanyModel',
      required: true,
    },
    reason: { type: String, required: true },
    description: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const SpamModel = model<ISpamReport>('SpamModel', spamSchema);