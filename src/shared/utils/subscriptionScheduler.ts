import cron from 'node-cron';
import { CustomError } from '../error/customError';
import { STATUS_CODES } from '../constants/statusCodes';
import { SubscriptionRepository } from '../../Infrastructure2/persistance/repositories/SubscriptionRepository';
import { UserRepository } from '../../Infrastructure2/persistance/repositories/UserRepository';
import { SubscriptionsUseCase } from '../../Application2/usecases/subscriptions/subscriptionUseCase';
import { EmailService } from '../../Infrastructure2/services/EmailService';
import { ClearExpiredRefreshTokensUseCase } from '../../Application2/usecases/auth/clearExpiredTokens';

const subscriptionRepo = new SubscriptionRepository()
const userRepo = new UserRepository();
const emailService = new EmailService()
const subscriptionsUseCase = new SubscriptionsUseCase(
  subscriptionRepo,
  userRepo,
  emailService
);

const cleanTokenUseCase = new ClearExpiredRefreshTokensUseCase(userRepo, process.env.REFRESH_TOKEN_SECRET!);

export const scheduleSubscriptionJobs = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled job: Check expired subscriptions');
    try {
      await subscriptionsUseCase.checkExpiredSubscriptions();
    } catch (error) {
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error in scheduling job'
      );
    }
  });
};




export const scheduleRefreshTokenCleanup = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running refresh token cleanup job');
    try {
      await cleanTokenUseCase.execute();
    } catch (error) {
      console.error('Error during token cleanup:', error);
    }
  });
};
