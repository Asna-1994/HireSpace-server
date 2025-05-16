import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { ISubscriptionRepo } from '../../../Domain2/respositories/ISubscriptionRepo';
import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { IEmailService } from '../../../Domain2/services/IEmailService';
import { SendSubscriptionExpiredEmailDTO } from '../../dto/mail/MailDTO';

export class SubscriptionsUseCase {
  constructor(
    private subscriptionRepo: ISubscriptionRepo,
    private userRepo: IUserRepository,
    private emailService : IEmailService,
  ) {}

  async checkExpiredSubscriptions() {
    const now = new Date();

    try {
      const usersWithSubscriptions =
        await this.userRepo.findUsersWithActiveSubscriptions();

      for (const user of usersWithSubscriptions) {
        const { appPlan } = user;

        if (appPlan?.endDate && new Date(appPlan.endDate) < now) {
          const { subscriptionId } = appPlan;

          if (subscriptionId) {
            await this.subscriptionRepo.updateSubscriptionStatusById(
              subscriptionId.toString(),
              false
            );
          }

          user.appPlan = {
            planType: 'basic',
            startDate: null,
            endDate: null,
            subscriptionId: null,
          };
          user.isPremium = false;
          await this.userRepo.update(user);

          const dataToSendEmail :SendSubscriptionExpiredEmailDTO  = {
            email : user.email,
            userName : user.userName!
          }

          this.emailService.sendSubscriptionExpiredEmail(dataToSendEmail);

          console.log(
            `Subscription ${subscriptionId} for user ${user._id} marked as expired.`
          );
        }
      }
    } catch (error: any) {
      console.error(
        'Error in checking expired subscriptions:',
        error.message || error
      );
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error in checking expired subscriptions'
      );
    }
  }
}
