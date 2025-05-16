


import mongoose from 'mongoose';
import { IPaymentRepository } from '../../../Domain2/respositories/IPaymentRepository';
import { IPayment } from '../../../Domain2/entities/Payment';
import { PaymentModel } from '../models/PaymentModel';
import { IPaymentDTO } from '../../../Application2/dto/payment/PaymentDTO';
import { normalizePayment } from '../../../shared/utils/Normalisation/normalizePayment';

export class PaymentRepository implements IPaymentRepository {
  async createPayment(
    paymentData: Partial<IPayment>,
    session?: mongoose.ClientSession
  ): Promise<IPaymentDTO> {
    const newPayment = await PaymentModel.create([{ ...paymentData }], {
      session,
    });

    return normalizePayment(newPayment[0].toObject());
  }

  async findAndUpdate(
    filter: object,
    update: object,
    session?: mongoose.ClientSession
  ): Promise<IPaymentDTO | null> {
    const updatedPayment = await PaymentModel.findOneAndUpdate(filter, update, {
      session,
      new: true,
    }).lean();
    return updatedPayment ? normalizePayment(updatedPayment) : null;
  }
}
