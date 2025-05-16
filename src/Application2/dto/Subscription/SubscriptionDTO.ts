export interface ISubscriptionsDTO {
  _id: string;
  userId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  paymentId: string;
  isActive: boolean;
  paymentStatus: 'success' | 'pending' | 'failed';
  transactionId: string;
  createdAt?: Date;
  updatedAt?: Date;


}