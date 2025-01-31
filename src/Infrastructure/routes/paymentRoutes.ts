import express from 'express';
import { PaymentController } from '../controller/payment/paymentController';

const router = express.Router();



router.post('/create-intent', PaymentController.createPaymentIntent);
router.post('/success',  PaymentController.handlePaymentSuccess
);

export default router;
