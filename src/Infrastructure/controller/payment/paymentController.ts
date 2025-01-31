
import { Request, Response, NextFunction } from 'express';
import { CreatePaymentIntentUseCase } from '../../../Application/usecases/payments/createPaymentIntentUseCase';
import { HandlePaymentSuccessUseCase } from '../../../Application/usecases/payments/handlePaymentSuccessUseCase';
import { PaymentRepoImpl } from '../../../Domain/repository/implementation/paymentRepoImp';
import { PlanRepositoryImpl } from '../../../Domain/repository/implementation/planRepoImpl';
import { UserRepositoryImpl } from '../../../Domain/repository/implementation/userRepositoryImpl';
import { SubscriptionRepoImpl } from '../../../Domain/repository/implementation/subscriptionRepoImpl';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';

const handlePaymentSuccessUseCase= new HandlePaymentSuccessUseCase(new PaymentRepoImpl(), new SubscriptionRepoImpl(),new UserRepositoryImpl(), new PlanRepositoryImpl());
const createPaymentIntentUseCase = new  CreatePaymentIntentUseCase(new PaymentRepoImpl(), new SubscriptionRepoImpl())
export const PaymentController =  {


  async createPaymentIntent(req: Request, res: Response, next: NextFunction) {
    const { planPrice, planDuration } = req.body;
    const { userId , planId } = req.query


    try {





      const{ paymentIntent, clientSecret}= await createPaymentIntentUseCase.execute({
        userId : userId as string,
        planId: planId as string,
        planPrice,
        planDuration,
      });

      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: 'Payment intent created',
        data:{
            paymentIntent,
            clientSecret
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async handlePaymentSuccess(req: Request, res: Response, next: NextFunction) {
    const { paymentIntentId } = req.body;

    try {
      const{ subscription, updatedUser} = await handlePaymentSuccessUseCase.execute(paymentIntentId);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: 'Payment processed and subscription activated',
        data: {subscription,updatedUser}
      });
    } catch (error) {
      next(error);
    }
  }
}
