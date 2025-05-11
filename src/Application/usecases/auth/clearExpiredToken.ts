import { UserRepository } from "../../../Domain/repository/repo/userRepository";

export class ClearExpiredRefreshTokensUseCase {
    constructor(private userRepository: UserRepository, private refreshTokenSecret: string) {}
  
    async execute() {
      await this.userRepository.clearExpiredRefreshTokens(this.refreshTokenSecret);
    }
  }

  