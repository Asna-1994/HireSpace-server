import mongoose from "mongoose";
import { Subscriptions } from "../../entities/Subscription";

export interface SubscriptionRepo {
  findExpiredSubscriptions(currentDate: Date): Promise<Subscriptions[] | []>;
  createSubscription(
    data: Partial<Subscriptions>,
    session?: mongoose.ClientSession,
  ): Promise<Subscriptions>;
  updateSubscriptionStatus(
    transactionId: string,
    status: string,
  ): Promise<Subscriptions | null>;
  findOne(filter: object): Promise<Subscriptions | null>;
  updateSubscriptionStatusById(
    subscriptionId: string,
    isActive: boolean,
  ): Promise<Subscriptions | null>;
}
