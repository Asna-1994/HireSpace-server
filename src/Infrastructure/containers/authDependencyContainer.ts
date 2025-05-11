import { LogoutUseCase } from "../../Application/usecases/auth/LogoutUsecase";
import { RefreshUseCase } from "../../Application/usecases/auth/refreshUsecase";
import { CompanyRepositoryImpl } from "../../Domain/repository/implementation/companyRepoImpl";
import { UserRepositoryImpl } from "../../Domain/repository/implementation/userRepositoryImpl";
import { LogoutController } from "../controller/authController/logoutController";
import { RefreshController } from "../controller/authController/refreshController";


// Repositories
const userRepository = new UserRepositoryImpl();
const companyRepository = new CompanyRepositoryImpl();

// Use cases
const logoutUseCase = new LogoutUseCase(userRepository);
const refreshUseCase = new RefreshUseCase(userRepository, companyRepository);

// Controllers
const logoutController = new LogoutController(logoutUseCase);
const refreshController = new RefreshController(refreshUseCase);

export const authContainer = {
  logoutController,
  refreshController,
};
