import { UserRepository } from "../../../Domain/repository/repo/userRepository";
import { CustomError } from "../../../shared/error/customError";
import { CompanyRepository } from "../../../Domain/repository/repo/companyRepository";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";

export class BlockOrUnblockUserUseCase {
  constructor(
    private UserRepository: UserRepository,

  ) {}

  async execute( userId: string, action: string) {

    let   updatedUser = await this.UserRepository.blockOrUnblock(userId, action );
    
    if (!updatedUser) {
        throw new CustomError(STATUS_CODES.NOT_FOUND, `user not found`);
      }
    return updatedUser;
  }
}
