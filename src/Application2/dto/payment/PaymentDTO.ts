export interface IPaymentDTO {
  _id: string;
  userId: string;
  planId: string;
  amountPaid: number;
  paymentDate: Date;
  paymentMethod: string;
  paymentStatus: 'success' | 'pending' | 'failed';
  transactionId: string;
  createdAt?: Date;
  updatedAt?: Date;

}
