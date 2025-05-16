import { IPaymentDTO } from '../../../Application2/dto/payment/PaymentDTO';
import { IPayment } from '../../../Domain2/entities/Payment';
import { STATUS_CODES } from '../../constants/statusCodes';
import { CustomError } from '../../error/customError';


export const normalizePayment = (data: any): IPaymentDTO => {
  //   console.log('Received payment data:', data);
  if (!data || !data._id) {
    throw new CustomError(
      STATUS_CODES.BAD_REQUEST,
      'Invalid data or missing _id in payment'
    );
  }

  return {
    ...data,
    _id: data._id.toString(),
    userId: data.userId.toString(),
    planId: data.planId.toString(),
  };
};