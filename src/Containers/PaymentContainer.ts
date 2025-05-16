
import { CreatePaymentIntentUseCase } from '../Application2/usecases/payment/createPaymentIntentUsecase';
import { PaymentRepository } from "../Infrastructure2/persistance/repositories/PaymentRepository";
import { SubscriptionRepository } from "../Infrastructure2/persistance/repositories/SubscriptionRepository";
import { PaymentController } from "../Interface2/controller/PaymentController/PaymentController";
import { HandlePaymentSuccessUseCase } from "../Application2/usecases/payment/handlePaymentSuccessUseCase";
import { UserRepository } from '../Infrastructure2/persistance/repositories/UserRepository';
import { PlanRepository } from '../Infrastructure2/persistance/repositories/PlanRepository';



const paymentRepository = new PaymentRepository()
const subscriptionRepo = new SubscriptionRepository()
const userRepo = new UserRepository()
const planRepo = new PlanRepository()



const createPaymentIntentUseCase = new CreatePaymentIntentUseCase(paymentRepository, subscriptionRepo)
const handleSuccessUseCase = new HandlePaymentSuccessUseCase(paymentRepository, subscriptionRepo, userRepo, planRepo)
const paymentController = new PaymentController(createPaymentIntentUseCase, handleSuccessUseCase)





export  {paymentController};
