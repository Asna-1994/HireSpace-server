import mongoose from 'mongoose';
import { stripe } from "../../../shared/utils/stripeClient";
import { PaymentRepository } from "../../../Domain/repository/repo/paymentRepo";
import { SubscriptionRepo } from "../../../Domain/repository/repo/subscriptionRepo";
import { UserRepository } from "../../../Domain/repository/repo/userRepository";
import { PlanRepository } from "../../../Domain/repository/repo/planRepo";
import { CustomError } from "../../../shared/error/customError";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";
import { MESSAGES } from "../../../shared/constants/messages";

export class HandlePaymentSuccessUseCase {
  constructor(
    private paymentRepo: PaymentRepository,
    private subscriptionRepo: SubscriptionRepo,
    private userRepo: UserRepository,
    private planRepo: PlanRepository
  ) {}

  async execute(paymentIntentId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
   
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);


      if (paymentIntent.status !== "succeeded") {
        throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, "Payment not successful");
      }

      const { userId, planId, planDuration ,paymentId} = paymentIntent.metadata;
  


      const updatedPayment = await this.paymentRepo.findAndUpdate(
        { transactionId: paymentIntent.id },
        {
          paymentStatus: 'success',
        },
         session 
      );

      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + parseInt(planDuration, 10));

    
      const subscription = await this.subscriptionRepo.createSubscription(
        {
          userId: new mongoose.Types.ObjectId(userId),
          planId: new mongoose.Types.ObjectId(planId),
          startDate,
          endDate,
          isActive: true,
          paymentStatus: 'success',
          transactionId: paymentIntent.id,
          paymentId : new mongoose.Types.ObjectId(paymentId)
        },
         session  
      );

    
      const plan = await this.planRepo.getPlanById(planId);
      if (!plan) {
        throw new CustomError(STATUS_CODES.NOT_FOUND, "Plan not found");
      }

     
      const user = await this.userRepo.findById(userId);
      if (!user) {
        throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
      }

   
      user.appPlan = {
        planType: plan.planType,
        startDate,
        endDate,
        subscriptionId : subscription._id
      };
      user.isPremium  = true;

      const updatedUser = await this.userRepo.update(user,  session ); 

    
      await session.commitTransaction();

      return { subscription, updatedUser };
    } catch (error) {
      await session.abortTransaction();
      console.error("Error handling payment success:", error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, "Failed to process payment success");
    } finally {
      session.endSession();
    }
  }
}

