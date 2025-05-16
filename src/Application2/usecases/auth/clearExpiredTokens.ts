import { IUserRepository } from "../../../Domain2/respositories/IUserRepository";


export class ClearExpiredRefreshTokensUseCase {
    constructor(private userRepository: IUserRepository, private refreshTokenSecret: string) {}
  
    async execute() {
      await this.userRepository.clearExpiredRefreshTokens(this.refreshTokenSecret);
    }
  }

  