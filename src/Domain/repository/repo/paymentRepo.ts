

import mongoose from "mongoose";
import { Payment } from "../../entities/Payment";

export interface PaymentRepository {
    createPayment(paymentData: Partial<Payment>, session?: mongoose.ClientSession) : Promise<Payment>;
    findAndUpdate(filter : object, update : object, session?: mongoose.ClientSession) : Promise<Payment | null>;
}
