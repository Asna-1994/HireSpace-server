import mongoose from 'mongoose';
import { stripe } from '../../../shared/utils/stripeClient';
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { IPaymentRepository } from '../../../Domain2/respositories/IPaymentRepository';
import { ISubscriptionRepo } from '../../../Domain2/respositories/ISubscriptionRepo';

export class CreatePaymentIntentUseCase {
  constructor(
    private paymentRepo: IPaymentRepository,
    private subscriptionRepo: ISubscriptionRepo
  ) {}

  async execute({
    userId,
    planId,
    planPrice,
    planDuration,
  }: {
    userId: string;
    planId: string;
    planPrice: number;
    planDuration: number;
  }) {
    const filter = {
      userId,
      isActive: true,
      endDate: { $gte: new Date() },
    };

    console.log(filter);
    const activeSubscription = await this.subscriptionRepo.findOne(filter);

    if (activeSubscription) {
      throw new CustomError(
        STATUS_CODES.CONFLICT,
        MESSAGES.ALREADY_SUBSCRIBED
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: planPrice * 100,
      currency: 'inr',
      metadata: {
        userId: userId,
        planId: planId,
        planDuration: planDuration,
      },
    });

    // console.log('created intent',paymentIntent)
    const paymentDocument = await this.paymentRepo.createPayment({
      userId: new mongoose.Types.ObjectId(userId),
      planId: new mongoose.Types.ObjectId(planId),
      amountPaid: planPrice,
      paymentStatus: 'pending',
      paymentDate: new Date(),
      paymentMethod: 'card',
      transactionId: paymentIntent.id,
    });

    await stripe.paymentIntents.update(paymentIntent.id, {
      metadata: {
        ...paymentIntent.metadata,
        paymentId: paymentDocument._id.toString(),
      },
    });

    return {
      paymentIntent,
      clientSecret: paymentIntent.client_secret,
    };
  }
}
