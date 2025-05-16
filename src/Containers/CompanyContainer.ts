import { ForgotPasswordUseCase } from "../Application2/usecases/company-auth/forgotPasswordUsecase";
import { CompanyLoginUseCase } from "../Application2/usecases/company-auth/loginUseCase";
import { VerifyOtpUseCase } from "../Application2/usecases/company-auth/otpVerificationUsecase";
import { ResendOtpUseCase } from "../Application2/usecases/company-auth/resendOtpUsecase";
import { SignupUseCase } from "../Application2/usecases/company-auth/signupUsecase";
import { CompanyJobApplicationUseCase } from "../Application2/usecases/company/CompanyJobApplicationUseCase";
import { HandleFileUploadUseCase } from "../Application2/usecases/company/HandleFile";
import { JobPostUseCase } from "../Application2/usecases/company/JobPostUseCase";
import { ManageDocumentUseCase } from "../Application2/usecases/company/ManageDocumentUseCase";
import { ManageLogoUseCase } from "../Application2/usecases/company/ManageLogoUseCase";
import { ManageMembersUseCase } from "../Application2/usecases/company/ManageMembersUseCase";
import { ManageProfileUseCase } from "../Application2/usecases/company/ManageProfileUsecase";
import { FileUploadUseCase } from "../Application2/usecases/shared/FileUploadUsecase";
import { CompanyProfileRepository } from "../Infrastructure2/persistance/repositories/CompanyProfileRepository";
import { CompanyRepository } from "../Infrastructure2/persistance/repositories/CompanyRepository";
import { JobApplicationRepository } from "../Infrastructure2/persistance/repositories/JobApplicationRepository";
import { JobPostRepository } from "../Infrastructure2/persistance/repositories/JobPostRepository";
import { JobSeekerProfileRepository } from "../Infrastructure2/persistance/repositories/JobSeekerProfileRepository";
import { SpamRepository } from "../Infrastructure2/persistance/repositories/SpamRepository";
import { TempCompanyRepository } from "../Infrastructure2/persistance/repositories/TempCompanyRepo";
import { TempUserRepository } from "../Infrastructure2/persistance/repositories/TempUserRepository";
import { UserRepository } from "../Infrastructure2/persistance/repositories/UserRepository";
import { AuthService } from "../Infrastructure2/services/AuthService";
import { EmailService } from "../Infrastructure2/services/EmailService";
import { FileUploadService } from "../Infrastructure2/services/FileUploadSevice";
import { ForgotPasswordController } from "../Interface2/controller/Company/forgotPasswordController";
import { CompanyJobApplicationController } from "../Interface2/controller/Company/JobApplicationCotroller";
import { JobPostController } from "../Interface2/controller/Company/JobPostController";
import { LoginController } from "../Interface2/controller/Company/loginController";
import { ManageDocumentController } from "../Interface2/controller/Company/ManageDocumentController";
import { ManageLogoController } from "../Interface2/controller/Company/ManageLogoController";
import { ManageMembersController } from "../Interface2/controller/Company/ManageMembersController";
import { ManageProfileController } from "../Interface2/controller/Company/ManageProfileController";
import { VerifyOtpController } from "../Interface2/controller/Company/otpVerificationController";
import { ResendOtpController } from "../Interface2/controller/Company/resendOtpController";
import { SignupController } from "../Interface2/controller/Company/signupController";


const tempCompanyRepository = new TempCompanyRepository()
const userRepository = new UserRepository()
const companyProfileRepo = new CompanyProfileRepository()
const jobSeekerProfileRepository = new JobSeekerProfileRepository()
const jobPostRepository = new JobPostRepository()
const jobApplicationRepository = new JobApplicationRepository();
const spamRepository = new SpamRepository();
const companyRepository = new CompanyRepository();
const authService = new AuthService()
const emailService = new EmailService()
const fileService = new FileUploadService()

const loginUseCase = new CompanyLoginUseCase(companyRepository, userRepository, authService)
const signUpUseCase = new SignupUseCase(tempCompanyRepository, companyRepository,userRepository, emailService,authService)
const resendOtpUseCase = new ResendOtpUseCase(tempCompanyRepository, emailService)
const forgotPassword  =new ForgotPasswordUseCase(companyRepository, authService)
const verifyOtp = new VerifyOtpUseCase(tempCompanyRepository, companyRepository, userRepository,companyProfileRepo)
const fileUploadUseCase = new FileUploadUseCase(fileService)
const manageLogoUseCase = new ManageLogoUseCase(fileUploadUseCase,companyRepository)
const handleFileUploadUseCase= new HandleFileUploadUseCase(fileService, companyRepository)
const manageDocumentUseCase = new ManageDocumentUseCase(fileUploadUseCase,companyRepository)
const manageMemberUseCase = new ManageMembersUseCase(companyRepository,userRepository)
const manageProfileUseCase = new ManageProfileUseCase(companyRepository,companyProfileRepo)
const jobPostUseCase = new JobPostUseCase(companyRepository,jobPostRepository)
const jobApplicationUseCase  = new CompanyJobApplicationUseCase(jobApplicationRepository)

const forgotPasswordController = new ForgotPasswordController(forgotPassword)
const companyLoginController = new LoginController(loginUseCase)
const resendOtpController = new ResendOtpController(resendOtpUseCase)
const signupController = new SignupController(signUpUseCase)
const otpVerificationController = new VerifyOtpController(verifyOtp)
const manageLogoController = new ManageLogoController(handleFileUploadUseCase,manageLogoUseCase)
const manageDocumentController = new ManageDocumentController(handleFileUploadUseCase, manageDocumentUseCase)
const manageMemberController = new ManageMembersController(manageMemberUseCase)
const manageProfileController = new ManageProfileController(manageProfileUseCase)
const jobPostController =  new JobPostController(jobPostUseCase)
const jobApplicationController = new CompanyJobApplicationController(jobApplicationUseCase)

export { forgotPasswordController ,
    companyLoginController,
     resendOtpController,
      signupController, 
      otpVerificationController,
      manageLogoController,
      manageDocumentController,
      manageMemberController,
      manageProfileController,
      jobPostController,
      jobApplicationController

    }