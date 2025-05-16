
import { IPlansDTO } from '../../../Application2/dto/Plans/PlansDTO';
import { STATUS_CODES } from '../../constants/statusCodes';
import { CustomError } from '../../error/customError';


export const normalizePlans = (data: any): IPlansDTO => {

  if (!data || !data._id) {
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      'Invalid data or missing _id'
    );
  }

  return {
    ...data,
    _id: data._id.toString(),
  };
};
