
import { PaymentRepository } from '../repo/paymentRepo';
import { PaymentModel } from '../../../Infrastructure/models/PaymentModel';
import { normalizePayment, Payment } from '../../entities/Payment';
import mongoose from 'mongoose';

export class PaymentRepoImpl implements PaymentRepository {

  async createPayment (paymentData: Partial<Payment>, session?: mongoose.ClientSession): Promise<Payment> {
    const newPayment = await PaymentModel.create([ { ...paymentData } ], { session });

 
    return normalizePayment(newPayment[0].toObject());

  };

  async findAndUpdate(filter : object, update : object, session?: mongoose.ClientSession): Promise<Payment | null> {
    const updatedPayment = await PaymentModel.findOneAndUpdate(filter, update, { session, new: true } ).lean()
    return updatedPayment ? normalizePayment(updatedPayment)  : null
   };

}
