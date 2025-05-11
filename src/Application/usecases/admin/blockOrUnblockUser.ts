import { UserRepository } from '../../../Domain/repository/repo/userRepository';
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';

export class BlockOrUnblockUserUseCase {
  constructor(private UserRepository: UserRepository) {}

  async execute(userId: string, action: string) {
   let updatedUser = await this.UserRepository.blockOrUnblock(
      userId,
      action
    );



    if (!updatedUser) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
    }
    return updatedUser;
  }
}
