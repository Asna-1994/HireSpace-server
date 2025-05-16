import express from 'express';
import { paymentController } from '../../Containers/PaymentContainer';


const router = express.Router();

router.post('/create-intent',paymentController.createPaymentIntent);
router.post('/success', paymentController.handlePaymentSuccess);

export default router;
