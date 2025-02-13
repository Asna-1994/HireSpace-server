import mongoose from 'mongoose';
import { PaymentRepository } from '../../../Domain/repository/repo/paymentRepo';
import { SubscriptionRepo } from '../../../Domain/repository/repo/subscriptionRepo';
import { stripe } from '../../../shared/utils/stripeClient';
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';

export class CreatePaymentIntentUseCase {
  constructor(
    private paymentRepo: PaymentRepository,
    private subscriptionRepo: SubscriptionRepo
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
        'User already has an active subscription for this plan'
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: planPrice * 100,
      currency: 'inr',
      //   amount: planPrice * 100,
      //   currency: "usd",
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
