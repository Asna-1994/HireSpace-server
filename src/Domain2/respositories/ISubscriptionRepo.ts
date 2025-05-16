import mongoose from 'mongoose';
import { ISubscriptions } from '../entities/Subscription';
import { ISubscriptionsDTO } from '../../Application2/dto/Subscription/SubscriptionDTO';


export interface ISubscriptionRepo {
  findExpiredSubscriptions(currentDate: Date): Promise<ISubscriptionsDTO[] | []>;
  createSubscription(
    data: Partial<ISubscriptions>,
    session?: mongoose.ClientSession
  ): Promise<ISubscriptionsDTO>;
  updateSubscriptionStatus(
    transactionId: string,
    status: string
  ): Promise<ISubscriptionsDTO | null>;
  findOne(filter: object): Promise<ISubscriptionsDTO | null>;
  updateSubscriptionStatusById(
    subscriptionId: string,
    isActive: boolean
  ): Promise<ISubscriptionsDTO | null>;
}
