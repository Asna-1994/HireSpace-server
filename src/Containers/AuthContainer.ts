import { LogoutUseCase } from "../Application2/usecases/auth/LogoutUseCase";
import { RefreshUseCase } from "../Application2/usecases/auth/refreshTokenUseCase";
import { ValidateEntityNotBlockedUseCase } from "../Application2/usecases/shared/ValidateEntityNotBlocked";
import { CompanyRepository } from "../Infrastructure2/persistance/repositories/CompanyRepository";
import { UserRepository } from "../Infrastructure2/persistance/repositories/UserRepository";
import { AuthService } from "../Infrastructure2/services/AuthService";
import { AuthController } from "../Interface2/controller/authController/AuthController";
import { AuthenticationMiddleware } from "../Interface2/middleware/authenticationMiddlewares";



const userRepository = new UserRepository()
const companyRepository = new CompanyRepository();
const authService = new AuthService()


const logoutUseCase = new LogoutUseCase(userRepository, authService)
const refreshUseCse  =new RefreshUseCase(userRepository, companyRepository, authService)
const validateEntityUseCase =new ValidateEntityNotBlockedUseCase(userRepository,companyRepository)

const authController = new AuthController(logoutUseCase, refreshUseCse)

const authenticationMiddleware = new AuthenticationMiddleware(validateEntityUseCase)



export  {authController, authenticationMiddleware};
