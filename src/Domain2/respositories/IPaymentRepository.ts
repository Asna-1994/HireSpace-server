import mongoose from 'mongoose';
import { IPayment } from '../entities/Payment';
import { IPaymentDTO } from '../../Application2/dto/payment/PaymentDTO';


export interface IPaymentRepository {
  createPayment(
    paymentData: Partial<IPayment>,
    session?: mongoose.ClientSession
  ): Promise<IPaymentDTO>;
  findAndUpdate(
    filter: object,
    update: object,
    session?: mongoose.ClientSession
  ): Promise<IPaymentDTO | null>;
}
