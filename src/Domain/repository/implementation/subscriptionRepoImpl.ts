import { SubscriptionRepo } from "./../repo/subscriptionRepo";
import { SubscriptionModel } from "../../../Infrastructure/models/SubscriptionModel";
import {
  normalizeSubscriptions,
  Subscriptions,
} from "../../entities/Subscription";
import mongoose from "mongoose";

export class SubscriptionRepoImpl implements SubscriptionRepo {
  async createSubscription(
    subscriptionData: Partial<Subscriptions>,
    session?: mongoose.ClientSession,
  ): Promise<Subscriptions> {
    const newSub = await SubscriptionModel.create([{ ...subscriptionData }], {
      session,
    });
    return normalizeSubscriptions(newSub[0].toObject());
  }

  async updateSubscriptionStatus(
    transactionId: string,
    status: string,
  ): Promise<Subscriptions | null> {
    const updatedSubscription = await SubscriptionModel.findOneAndUpdate(
      { transactionId },
      { paymentStatus: status, isActive: true },
      { new: true },
    );
    return updatedSubscription
      ? normalizeSubscriptions(updatedSubscription)
      : null;
  }

  async findOne(filter: object): Promise<Subscriptions | null> {
    const subscription = await SubscriptionModel.findOne(filter).lean().exec();
    return subscription ? normalizeSubscriptions(subscription) : null;
  }

  async findExpiredSubscriptions(
    currentDate: Date,
  ): Promise<Subscriptions[] | []> {
    const subscriptions = await SubscriptionModel.find({
      isActive: true,
      endDate: { $lte: currentDate },
    });
    return subscriptions.map(normalizeSubscriptions);
  }
  async updateSubscriptionStatusById(
    subscriptionId: string,
    isActive: boolean,
  ): Promise<Subscriptions | null> {
    const updatedSubscription = await SubscriptionModel.findByIdAndUpdate(
      subscriptionId,
      { isActive },
    );
    return updatedSubscription
      ? normalizeSubscriptions(updatedSubscription)
      : null;
  }
}
