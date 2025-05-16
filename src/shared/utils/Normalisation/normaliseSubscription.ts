
import { ISubscriptionsDTO } from '../../../Application2/dto/Subscription/SubscriptionDTO';
import { STATUS_CODES } from '../../constants/statusCodes';
import { CustomError } from '../../error/customError';


export const normalizeSubscriptions = (data: any): ISubscriptionsDTO => {
  // console.log('Received subs data:', data);
  if (!data || !data._id) {
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      'Invalid data or missing _id'
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