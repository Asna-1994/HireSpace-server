
import mongoose from 'mongoose';
import { IJobPostDTO } from '../../../Application2/dto/JobPost/JobPostDTO';
import { IJobPost } from '../../../Domain2/entities/JobPost';
import { CustomError } from '../../error/customError';
import { STATUS_CODES } from '../../constants/statusCodes';




export const normalizeJobPost = (data: any): IJobPostDTO => {
  if (!data || !data.companyId || !data.postedBy) {
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      'Invalid data: missing required fields.'
    );
  }

  return {
    ...data,
    _id: data._id?.toString(),
    companyId: {
      ...data.companyId,
      _id: data.companyId._id?.toString(),
    },
    postedBy: data.postedBy.toString(),
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
    applicationDeadline: new Date(data.applicationDeadline),
    employmentStartDate: new Date(data.employmentStartDate),
  };
};

export const deNormalizeJobPost = (data: any): IJobPost => {
  if (!data || !data.companyId || !data.companyId._id || !data.postedBy) {
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      'Invalid data: missing required fields.'
    );
  }

  const companyIdStr = data.companyId._id;
  const postedByStr = data.postedBy;
  const jobPostIdStr = data._id;



  return {
    ...data,
    _id: new mongoose.Types.ObjectId(jobPostIdStr),
    companyId: new mongoose.Types.ObjectId(companyIdStr),
    postedBy: new mongoose.Types.ObjectId(postedByStr),
  };
};
