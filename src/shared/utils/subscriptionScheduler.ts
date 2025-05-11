import cron from 'node-cron';
import { SubscriptionsUseCase } from '../../Application/usecases/subscriptions/subscriptionsUseCase';
import { SubscriptionRepoImpl } from '../../Domain/repository/implementation/subscriptionRepoImpl';
import { UserRepositoryImpl } from '../../Domain/repository/implementation/userRepositoryImpl';
import { CustomError } from '../error/customError';
import { STATUS_CODES } from '../constants/statusCodes';
import { ClearExpiredRefreshTokensUseCase } from '../../Application/usecases/auth/clearExpiredToken';

const subscriptionRepo = new SubscriptionRepoImpl();
const userRepo = new UserRepositoryImpl();
const subscriptionsUseCase = new SubscriptionsUseCase(
  subscriptionRepo,
  userRepo
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
