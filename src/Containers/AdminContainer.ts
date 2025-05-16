
import { AdminAuthUseCase } from "../Application2/usecases/admin/AdminAuthUseCase";
import { BlockOrUnblockCompanyUseCase } from "../Application2/usecases/admin/BlockOrUnblockCompany";
import { BlockOrUnblockUserUseCase } from "../Application2/usecases/admin/BlockOrUnblockUser";
import { DashboardUseCase } from "../Application2/usecases/admin/DashBoardUseCase";
import { GetAllCompaniesUseCase } from "../Application2/usecases/admin/GetAllCompaniesUsecase";
import { GetAllUsersUseCase } from "../Application2/usecases/admin/GetAllUsersUsecase";
import { CompanyRepository } from "../Infrastructure2/persistance/repositories/CompanyRepository";
import { JobApplicationRepository } from "../Infrastructure2/persistance/repositories/JobApplicationRepository";
import { JobPostRepository } from "../Infrastructure2/persistance/repositories/JobPostRepository";
import { JobSeekerProfileRepository } from "../Infrastructure2/persistance/repositories/JobSeekerProfileRepository";
import { SpamRepository } from "../Infrastructure2/persistance/repositories/SpamRepository";
import { TempUserRepository } from "../Infrastructure2/persistance/repositories/TempUserRepository";
import { UserRepository } from "../Infrastructure2/persistance/repositories/UserRepository";
import { AuthService } from "../Infrastructure2/services/AuthService";
import { EmailService } from "../Infrastructure2/services/EmailService";
import { FileUploadService } from "../Infrastructure2/services/FileUploadSevice";
import { AdminAuthController } from "../Interface2/controller/adminController/AdminAuthController";
import { BlockOrUnblockCompanyController } from "../Interface2/controller/adminController/BlockOrUnblockCompanyController";
import { BlockOrUnblockUserController } from "../Interface2/controller/adminController/BlockOrUnblockUserController";
import { DashboardController } from "../Interface2/controller/adminController/DashBoardController";
import { GetAllCompanyController } from "../Interface2/controller/adminController/GetAllCompanyController";
import { GetAllUsersController } from "../Interface2/controller/adminController/GetAlluserController";



const userRepository = new UserRepository()
const jobSeekerProfileRepository = new JobSeekerProfileRepository()
const jobPostRepository = new JobPostRepository()
const jobApplicationRepository = new JobApplicationRepository();
const spamRepository = new SpamRepository();
const companyRepository = new CompanyRepository();
const authService = new AuthService()
const emailService = new EmailService()
const fileService = new FileUploadService()

const adminAuthUseCase = new AdminAuthUseCase(userRepository, authService)
const blockUnblockCompanyUseCase  = new BlockOrUnblockCompanyUseCase(companyRepository,userRepository,jobPostRepository,emailService)
const blockUnblockUserUseCase  = new BlockOrUnblockUserUseCase(userRepository)
const dashBoardUseCase = new DashboardUseCase(userRepository,companyRepository, spamRepository,
 jobPostRepository,
   jobApplicationRepository)
   const getAllCompanies = new GetAllCompaniesUseCase(companyRepository)
   const getAllUsers = new GetAllUsersUseCase(userRepository,spamRepository)


const adminAuthController = new AdminAuthController(adminAuthUseCase)
const blockOrUnblockCompanyController = new BlockOrUnblockCompanyController(blockUnblockCompanyUseCase)
const blockOrUnblockUserController = new BlockOrUnblockUserController(blockUnblockUserUseCase)
const dashBoardController = new DashboardController(dashBoardUseCase)
const getAllCompaniesController = new GetAllCompanyController(getAllCompanies)
const getAllUsersController = new GetAllUsersController(getAllUsers)

export {adminAuthController,
    blockOrUnblockCompanyController ,
    dashBoardController,
     blockOrUnblockUserController,
     getAllCompaniesController,
     getAllUsersController

    }