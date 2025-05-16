import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { CreatePaymentIntentUseCase } from '../../../Application2/usecases/payment/createPaymentIntentUsecase';
import { HandlePaymentSuccessUseCase } from '../../../Application2/usecases/payment/handlePaymentSuccessUseCase';


export class PaymentController{

    constructor(private createPaymentUseCase : CreatePaymentIntentUseCase,
        private  handlePaymentSuccessUseCase : HandlePaymentSuccessUseCase
    ){}

 createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
    const { planPrice, planDuration } = req.body;
    const { userId, planId } = req.query;

    try {
      const { paymentIntent, clientSecret } =
        await this.createPaymentUseCase.execute({
          userId: userId as string,
          planId: planId as string,
          planPrice,
          planDuration,
        });

      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: 'Payment intent created',
        data: {
          paymentIntent,
          clientSecret,
        },
      });
    } catch (error) {
      next(error);
    }
  }

   handlePaymentSuccess = async (req: Request, res: Response, next: NextFunction) => {
    const { paymentIntentId } = req.body;

    try {
      const { subscription, updatedUser } =
        await this.handlePaymentSuccessUseCase.execute(paymentIntentId);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: 'Payment processed and subscription activated',
        data: { subscription, updatedUser },
      });
    } catch (error) {
      next(error);
    }
  }
};
