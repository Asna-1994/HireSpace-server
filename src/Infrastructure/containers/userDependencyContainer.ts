
import { JobPostRepositoryImpl } from "../../Domain/repository/implementation/JobPostRepoImpl";
import { JobSeekerProfileImpl } from "../../Domain/repository/implementation/JobSeekerProfileImpl";
import { UserJobApplicationController } from './../controller/userController/jobApplicationControler';
import { UserJobApplicationUseCase } from './../../Application/usecases/user/userJobApplicationUseCase';
import { JobApplicationRepositoryImpl } from '../../Domain/repository/implementation/jobApplicationRepoImpl';
import { UserJobPostController } from './../controller/userController/userJobPostController';
import { UserJobPostUseCase } from './../../Application/usecases/user/userJobPostUseCase';
import { ManageProfileUseCase } from './../../Application/usecases/user/manageProfileUsecase';
import { UploadProfilePhotoController } from './../controller/userController/UploadProfilePhotoController';
import { FileUploadUseCase } from './../../Application/usecases/shared/fileUploadUsecase';
import { GoogleSignInController } from './../controller/userController/googleSigninController';
import { ResendOtpUseCase } from './../../Application/usecases/user/resendOtpUsecase';
import { VerifyOtpController } from '../controller/userController/verifyOtpController';
import { VerifyOtpUseCase } from '../../Application/usecases/user/otpVerificationUsecase';
import { SignupController } from '../controller/userController/singupController';
import { SignupUseCase } from '../../Application/usecases/user/signupUsecase';
import { sendOtpEmail, sendOtpSms } from '../email/emailService';
import { TempUserRepositoryImpl } from '../../Domain/repository/implementation/tempUserRepositoryImpl';
import { UserRepositoryImpl } from '../../Domain/repository/implementation/userRepositoryImpl';
import { LoginUseCase } from '../../Application/usecases/user/loginUsecase';
import { LoginController } from '../controller/userController/loginController';
import { ResendOtpController } from '../controller/userController/resendOtpConstroller';
import { GoogleSignInUseCase } from '../../Application/usecases/user/googleSiginUsecase';
import { ForgotPasswordUseCase } from '../../Application/usecases/user/forgotPasswordUseCase';
import { ForgotPasswordController } from '../controller/userController/forgotPasswordController';
import { ManageJobSeekerProfileController } from '../controller/userController/manageProfileController';
import { SpamRepositoryImpl } from '../../Domain/repository/implementation/spamRepoImpl';
import { CompanyRepositoryImpl } from "../../Domain/repository/implementation/companyRepoImpl";
import { AdminAuthUseCase } from "../../Application/usecases/admin/adminAuthUseCase";
import { AdminAuthController } from "../controller/adminController/AdminAuthController";
import { GetAllUsersUseCase } from "../../Application/usecases/admin/getAllUsersUsecase";
import { GetAllUsersController } from "../controller/adminController/getAlluserController";
import { GetAllCompaniesUseCase } from "../../Application/usecases/admin/getAllCompaniesUsecase";
import { GetAllCompanyController } from "../controller/adminController/getAllCompanyController";
import { BlockOrUnblockUserUseCase } from "../../Application/usecases/admin/blockOrUnblockUser";
import { BlockOrUnblockUserController } from "../controller/adminController/blockOrUnblockUserController";
import { BlockOrUnblockCompanyUseCase } from "../../Application/usecases/admin/blockOrUnblockCompany";
import { BlockOrUnblockCompanyController } from "../controller/adminController/blockOrUnblockCompanyController";
import { DashboardUseCase } from "../../Application/usecases/admin/dashBoardUseCase";
import { DashboardController } from "../controller/adminController/dashBoardController";


const tempUserRepository = new TempUserRepositoryImpl()
const userRepository = new UserRepositoryImpl()
const jobSeekerProfileRepository = new JobSeekerProfileImpl()
const jobPostRepository = new JobPostRepositoryImpl()
const jobApplicationRepository = new JobApplicationRepositoryImpl();
const spamRepository = new SpamRepositoryImpl();
const companyRepository = new CompanyRepositoryImpl();



//user
const verifyOtpUseCase = new VerifyOtpUseCase(
  tempUserRepository,
  userRepository,
  jobSeekerProfileRepository
);
const verifyOtpController = new VerifyOtpController(verifyOtpUseCase);

const signupUseCase = new SignupUseCase(
  tempUserRepository,
  userRepository,
  sendOtpEmail,
  sendOtpSms
);
const signupController = new SignupController(signupUseCase);

const loginUseCase = new LoginUseCase(
  userRepository
);
const loginController = new LoginController(loginUseCase);


const resendOtpUseCase = new ResendOtpUseCase(tempUserRepository, sendOtpEmail);
const resendOtpController = new ResendOtpController(resendOtpUseCase);

const googleSignInUseCase = new GoogleSignInUseCase(
  userRepository
);
const googleSigInController = new GoogleSignInController(googleSignInUseCase);

const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository);
const forgotPasswordController = new ForgotPasswordController(
  forgotPasswordUseCase
);

const fileUploadUseCase = new FileUploadUseCase();
const uploadProfilePhotoController = new UploadProfilePhotoController(
  fileUploadUseCase,
  userRepository,
  jobSeekerProfileRepository
);

const manageProfileUseCase = new ManageProfileUseCase(
  jobSeekerProfileRepository,
  userRepository
);
const manageJobSeekerProfileController = new ManageJobSeekerProfileController(
  manageProfileUseCase
);

const userJobPostUseCase = new UserJobPostUseCase(
  jobPostRepository,
  userRepository,
  spamRepository
);
const userJobPostController = new UserJobPostController(userJobPostUseCase);

const userJobApplicationUseCase = new UserJobApplicationUseCase(
  jobApplicationRepository,
  jobSeekerProfileRepository,
  userRepository,
  jobPostRepository
);
const userJobApplicationController = new UserJobApplicationController(
  userJobApplicationUseCase
);






//admin

const adminAuthUseCase = new AdminAuthUseCase(userRepository);
const adminAuthController = new AdminAuthController(adminAuthUseCase);

const getAllUsersUseCase = new GetAllUsersUseCase(
  userRepository,
  spamRepository
);
const getAllUsersController = new GetAllUsersController(getAllUsersUseCase);

const getAllCompanyUseCase = new GetAllCompaniesUseCase(companyRepository);
const getAllCompanyController = new GetAllCompanyController(
  getAllCompanyUseCase
);

const blockOrUnblockUserUseCase = new BlockOrUnblockUserUseCase(userRepository);
const blockOrUnblockUserController = new BlockOrUnblockUserController(
  blockOrUnblockUserUseCase
);

const blockOrUnblockCompanyUseCase = new BlockOrUnblockCompanyUseCase( companyRepository, userRepository, jobPostRepository);
const blockOrUnblockCompanyController = new BlockOrUnblockCompanyController(
  blockOrUnblockCompanyUseCase
);

const dashboardUseCase = new DashboardUseCase(
  userRepository,
  companyRepository,
  spamRepository,
  jobPostRepository,
  jobApplicationRepository
);
const dashboardController = new DashboardController(dashboardUseCase);



export const dependencyContainer = {
  userJobApplicationController,
  userJobPostController,
  manageJobSeekerProfileController,
  verifyOtpController,
  signupController,
  loginController,
  uploadProfilePhotoController,
  forgotPasswordController,
  resendOtpController,
  googleSigInController,
  dashboardController,
  blockOrUnblockCompanyController,
  adminAuthController,
  getAllCompanyController,
  getAllUsersController,
  blockOrUnblockUserController


  };
  