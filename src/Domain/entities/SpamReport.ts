import mongoose from 'mongoose';
import { CustomError } from '../../shared/error/customError';
import { STATUS_CODES } from '../../shared/constants/statusCodes';

export class SpamReport {
  _id: mongoose.Types.ObjectId;
  reportedByUser: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  isDeleted: boolean;
  reason: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<SpamReport>) {
    this._id = data._id!;
    this.reportedByUser = data.reportedByUser!;
    this.companyId = data.companyId!;
    this.isDeleted = data.isDeleted ?? false;
    this.reason = data.reason!;
    this.description = data.description;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export const normalizeSpam = (data: any): SpamReport => {
  //   console.log('Received Spam data:', data);
  if (!data || !data._id) {
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      'Invalid data or missing _id in payment'
    );
  }

  return {
    ...data,
    _id: data._id.toString(),
    reportedByUser: data.reportedByUser.toString(),
    companyId: data.companyId.toString(),
  };
};
