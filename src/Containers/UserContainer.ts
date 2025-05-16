
import { FileUploadUseCase } from "../Application2/usecases/shared/FileUploadUsecase";
import { ForgotPasswordUseCase } from "../Application2/usecases/user-auth/forgotPasswordUseCase";
import { GoogleSignInUseCase } from "../Application2/usecases/user-auth/googleSiginUseCase";
import { VerifyOtpUseCase } from "../Application2/usecases/user-auth/otpVerificationUseCase";
import { ResendOtpUseCase } from "../Application2/usecases/user-auth/resendOTPUseCase";
import { UserLoginUseCase } from "../Application2/usecases/user-auth/UserLoginUsecase";
import { UserSignupUseCase } from "../Application2/usecases/user-auth/UserSignupUsecase";
import { CertificateUseCase } from "../Application2/usecases/user/CertificatesUseCase";
import { EducationUseCase } from "../Application2/usecases/user/EducationUseCase";
import { ExperienceUseCase } from "../Application2/usecases/user/ExperinceUseCase";
import { ManageProfileUseCase } from "../Application2/usecases/user/ManageProfileUseCase";
import { SkillsUseCase } from "../Application2/usecases/user/SkillsUsecase";
import { UploadUseCase } from "../Application2/usecases/user/UploadUseCase";
import { UserJobApplicationUseCase } from "../Application2/usecases/user/UserJobApplicationUseCase";
import { UserJobPostUseCase } from "../Application2/usecases/user/UserJobPostUseCase";
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
import { CertificatesController } from "../Interface2/controller/UserController/CertificatesController";
import { EducationController } from "../Interface2/controller/UserController/EducationController";
import { ExperienceController } from "../Interface2/controller/UserController/ExperienceController";
import { ManageProfileController } from "../Interface2/controller/UserController/ManageProfileController";
import { SkillsController } from "../Interface2/controller/UserController/SkillController";
import { UploadController } from "../Interface2/controller/UserController/UploadController";
import { UserAuthController } from "../Interface2/controller/UserController/UserAuthController";
import { UserJobApplicationController } from "../Interface2/controller/UserController/UserJobApplicationController";
import { UserJobPostController } from "../Interface2/controller/UserController/UserJobPostController";


const tempUserRepository = new TempUserRepository()
const userRepository = new UserRepository()
const jobSeekerProfileRepository = new JobSeekerProfileRepository()
const jobPostRepository = new JobPostRepository()
const jobApplicationRepository = new JobApplicationRepository();
const spamRepository = new SpamRepository();
const companyRepository = new CompanyRepository();
const authService = new AuthService()
const emailService = new EmailService()
const fileService = new FileUploadService()

const userLoginUseCase = new UserLoginUseCase(userRepository, authService,)
const userSignupUseCase = new UserSignupUseCase(tempUserRepository, userRepository, emailService, authService)
const resendOtpUseCase = new ResendOtpUseCase(tempUserRepository, emailService)
const otpVerification = new VerifyOtpUseCase(tempUserRepository, userRepository, jobSeekerProfileRepository)
const googleSignin = new GoogleSignInUseCase(userRepository,authService)
const forgotPassword = new ForgotPasswordUseCase(userRepository, authService)
const userJobPostUseCase = new UserJobPostUseCase(jobPostRepository, userRepository, spamRepository)
const userJobApplication = new UserJobApplicationUseCase(jobApplicationRepository,jobSeekerProfileRepository,userRepository,jobPostRepository)
const skillsUseCase  = new SkillsUseCase(jobSeekerProfileRepository)
const educationUseCase  = new EducationUseCase(jobSeekerProfileRepository)
const certificateUseCase  = new CertificateUseCase(jobSeekerProfileRepository, userRepository)
const experienceUseCase  = new ExperienceUseCase(jobSeekerProfileRepository)
const manageProfileUseCase = new ManageProfileUseCase(jobSeekerProfileRepository, userRepository)

const fileUploadUseCase = new FileUploadUseCase(fileService)
const userUploadUseCase = new UploadUseCase(jobSeekerProfileRepository,userRepository, fileUploadUseCase)


const userAuthController = new UserAuthController(userLoginUseCase,  userSignupUseCase,forgotPassword,otpVerification ,
    resendOtpUseCase,
    googleSignin)


const userJobApplicationController = new UserJobApplicationController(userJobApplication)
const userJobPostController = new UserJobPostController(userJobPostUseCase)
const educationController = new EducationController(educationUseCase)
const skillsController = new SkillsController(skillsUseCase)
const experienceController = new ExperienceController(experienceUseCase)
const manageProfileController = new ManageProfileController(manageProfileUseCase)
const userFileUploadController = new UploadController(userUploadUseCase)
const certificateController = new CertificatesController(certificateUseCase)



export  {userAuthController,
    experienceController,
    manageProfileController,
     userJobApplicationController,
     skillsController,
      userJobPostController,
       educationController,
    certificateController,userFileUploadController};
