import mongoose from 'mongoose';
import { CustomError } from '../../shared/error/customError';
import { STATUS_CODES } from '../../shared/constants/statusCodes';


export class Payment {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    planId: mongoose.Types.ObjectId;
    amountPaid: number;
    paymentDate: Date;
    paymentMethod : string;
    paymentStatus: 'success' | "pending" | "failed";
    transactionId: string;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(data: Partial<Payment>) {
        this._id = data._id!;
        this.userId = data.userId!;
        this.planId = data.planId!;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.paymentMethod = data.paymentMethod!;
        this.transactionId = data.transactionId!;
        this.paymentStatus = data.paymentStatus || 'pending';
        this.amountPaid = data.amountPaid!;
        this.paymentDate = data.paymentDate!;
  
 
    }
  }

    export const normalizePayment = (data: any): Payment => {
        //   console.log('Received payment data:', data); 
          if (!data || !data._id) {
            throw new CustomError(STATUS_CODES.BAD_REQUEST,'Invalid data or missing _id in payment');
          }
        
          return {
            ...data,
            _id: data._id.toString(),
          userId : data.userId.toString(),
           planId : data.planId.toString(),
  
          };
        };