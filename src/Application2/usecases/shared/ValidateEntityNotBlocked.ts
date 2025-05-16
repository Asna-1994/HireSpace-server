
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { DecodedToken } from '../../../types/express';
import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { ICompanyRepository } from '../../../Domain2/respositories/ICompanyRepository';
import { MESSAGES } from '../../../shared/constants/messages';


export class ValidateEntityNotBlockedUseCase {
  constructor(
    private userRepo: IUserRepository,
  private companyRepo: ICompanyRepository
  ) {}

  async execute(user: DecodedToken): Promise<void> {
    const userId = user?.id;

    if (!userId || !user.entity) return;

    if (user.entity === 'user') {
      const userDoc = await this.userRepo.findById(userId);
      if (userDoc?.isBlocked) {
        throw new CustomError(
          STATUS_CODES.FORBIDDEN,
   MESSAGES.USER_BLOCKED
        );
      }
    } else if (user.entity === 'company') {
      const companyDoc = await this.companyRepo.findById(userId);
      if (companyDoc?.isBlocked) {
        throw new CustomError(
          STATUS_CODES.FORBIDDEN,
       MESSAGES.COMPANY_BLOCKED
        );
      }
    }
  }
}
