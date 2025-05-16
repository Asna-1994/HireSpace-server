import mongoose from 'mongoose';
import { ISubscriptionRepo } from '../../../Domain2/respositories/ISubscriptionRepo';
import { SubscriptionModel } from '../models/SubscriptionModel';
import { ISubscriptions } from '../../../Domain2/entities/Subscription';
import { ISubscriptionsDTO } from '../../../Application2/dto/Subscription/SubscriptionDTO';
import { normalizeSubscriptions } from '../../../shared/utils/Normalisation/normaliseSubscription';


export class SubscriptionRepository implements ISubscriptionRepo {
  async createSubscription(
    subscriptionData: Partial<ISubscriptions>,
    session?: mongoose.ClientSession
  ): Promise<ISubscriptionsDTO> {
    const newSub = await SubscriptionModel.create([{ ...subscriptionData }], {
      session,
    });
    return normalizeSubscriptions(newSub[0].toObject());
  }

  async updateSubscriptionStatus(
    transactionId: string,
    status: string
  ): Promise<ISubscriptionsDTO | null> {
    const updatedSubscription = await SubscriptionModel.findOneAndUpdate(
      { transactionId },
      { paymentStatus: status, isActive: true },
      { new: true }
    );
    return updatedSubscription
      ? normalizeSubscriptions(updatedSubscription)
      : null;
  }

  async findOne(filter: object): Promise<ISubscriptionsDTO | null> {
    const subscription = await SubscriptionModel.findOne(filter).lean().exec();
    return subscription ? normalizeSubscriptions(subscription) : null;
  }

  async findExpiredSubscriptions(
    currentDate: Date
  ): Promise<ISubscriptionsDTO[] | []> {
    const subscriptions = await SubscriptionModel.find({
      isActive: true,
      endDate: { $lte: currentDate },
    });
    return subscriptions.map(normalizeSubscriptions);
  }
  async updateSubscriptionStatusById(
    subscriptionId: string,
    isActive: boolean
  ): Promise<ISubscriptionsDTO | null> {
    const updatedSubscription = await SubscriptionModel.findByIdAndUpdate(
      subscriptionId,
      { isActive }
    );
    return updatedSubscription
      ? normalizeSubscriptions(updatedSubscription)
      : null;
  }
}
