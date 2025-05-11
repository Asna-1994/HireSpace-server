import { CompanyJobApplicationController } from './../controller/companyController/jobApplicationCotroller';
import { CompanyJobApplicationUseCase } from './../../Application/usecases/company/companyJobApplicationUseCase';
import { JobApplicationRepository } from '../../Domain/repository/repo/jobApplicationRepository';
import { ManageProfileController } from './../controller/companyController/manageProfileController';
import { ManageProfileUseCase } from './../../Application/usecases/company/manageProfileUsecase';
import { AddMembersUseCase } from './../../Application/usecases/company/addMembersUseCase';
import { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import { sendOtpEmail } from '../email/emailService';
import {
  companyEditValidationRules,
  companySignupValidationRules,
  validateRequest,
} from '../middleware/validationMiddlewares/signupValidation';
import { TempCompanyRepositoryImpl } from '../../Domain/repository/implementation/tempCompanyRepoImpl';
import { CompanyRepositoryImpl } from '../../Domain/repository/implementation/companyRepoImpl';
import { SignupUseCase } from '../../Application/usecases/company/signupUsecase';
import { SignupController } from '../controller/companyController/signupController';
import { VerifyOtpUseCase } from '../../Application/usecases/company/otpVerificationUsecase';
import { VerifyOtpController } from '../controller/companyController/otpVerificationController';
import { LoginUseCase } from '../../Application/usecases/company/loginUseCase';
import { LoginController } from '../controller/companyController/loginController';
import { LogoutController } from '../controller/userController/logoutController';
import { ResendOtpUseCase } from '../../Application/usecases/company/resendOtpUsecase';
import { ResendOtpController } from '../controller/companyController/resendOtpController';
import { ForgotPasswordUseCase } from '../../Application/usecases/company/forgotPasswordUsecase';
import { ForgotPasswordController } from '../controller/companyController/forgotPasswordController';
import { FileUploadUseCase } from '../../Application/usecases/shared/fileUploadUsecase';
import { UploadLogoController } from '../controller/companyController/uploadLogoController';
import { upload } from '../config/cloudinaryConfig';
import { UploadDocumentController } from '../controller/companyController/uploadDocumentController';
import { AddMembersController } from '../controller/companyController/addMembersConstroller';
import { UserRepositoryImpl } from '../../Domain/repository/implementation/userRepositoryImpl';
import { CompanyProfileImpl } from '../../Domain/repository/implementation/CompanyProfileImpl';
import { JobPostRepositoryImpl } from '../../Domain/repository/implementation/JobPostRepoImpl';
import { JobPostUseCase } from '../../Application/usecases/company/jobPostUseCase';
import { JobPostController } from '../controller/companyController/jobPostController';
import { JobApplicationRepositoryImpl } from '../../Domain/repository/implementation/jobApplicationRepoImpl';
import {
  checkIfAUthenticated,
  isCompany,
} from '../middleware/authenticationMiddleware';


const tempCompanyRepository = new TempCompanyRepositoryImpl();
const companyRepository = new CompanyRepositoryImpl();
const userRepository = new UserRepositoryImpl();
const companyProfileRepository = new CompanyProfileImpl();
const jobPostRepository = new JobPostRepositoryImpl();
const jobApplicationRepository = new JobApplicationRepositoryImpl();

const verifyOtpUseCase = new VerifyOtpUseCase(
  tempCompanyRepository,
  companyRepository,
  userRepository,
  companyProfileRepository
);
const verifyOtpController = new VerifyOtpController(verifyOtpUseCase);

const signupUseCase = new SignupUseCase(
  tempCompanyRepository,
  companyRepository,
  userRepository,
  sendOtpEmail
);
const signupController = new SignupController(signupUseCase);

const loginUseCase = new LoginUseCase(companyRepository, userRepository);
const loginController = new LoginController(loginUseCase);

const logoutController = new LogoutController();

const resendOtpUseCase = new ResendOtpUseCase(
  tempCompanyRepository,
  sendOtpEmail
);
const resendOtpController = new ResendOtpController(resendOtpUseCase);

const forgotPasswordUseCase = new ForgotPasswordUseCase(companyRepository);
const forgotPasswordController = new ForgotPasswordController(
  forgotPasswordUseCase
);

const fileUploadUseCase = new FileUploadUseCase();
const uploadLogoController = new UploadLogoController(
  fileUploadUseCase,
  companyRepository
);
const uploadDocumentController = new UploadDocumentController(
  fileUploadUseCase,
  companyRepository
);

const addMembersUseCase = new AddMembersUseCase(
  companyRepository,
  userRepository
);
const addMemberController = new AddMembersController(addMembersUseCase);

const manageProfileUseCase = new ManageProfileUseCase(
  companyRepository,
  companyProfileRepository
);
const manageProfileController = new ManageProfileController(
  manageProfileUseCase
);

const jobPostUseCase = new JobPostUseCase(companyRepository, jobPostRepository);
const jobPostController = new JobPostController(jobPostUseCase);

const companyJobApplicationUseCase = new CompanyJobApplicationUseCase(
  jobApplicationRepository
);
const companyJobApplicationController = new CompanyJobApplicationController(
  companyJobApplicationUseCase
);

const router = Router();

router.post('/verify-otp', (req, res, next) =>
  verifyOtpController.verifyOtp(req, res, next)
);
router.post(
  '/signup',
  companySignupValidationRules,
  validateRequest,
  (req: Request, res: Response, next: NextFunction) =>
    signupController.signup(req, res, next)
);
router.post('/login', (req, res, next) =>
  loginController.login(req, res, next)
);
router.post('/logout', (req, res, next) =>
  logoutController.logout(req, res, next)
);
router.post('/resend-otp', (req, res, next) =>
  resendOtpController.resendOtp(req, res, next)
);
router.patch('/forgot-password', (req, res, next) =>
  forgotPasswordController.changePassword(req, res, next)
);
router.patch(
  '/upload-company-logo/:companyId',
  checkIfAUthenticated,
  isCompany,
  upload.single('companyLogo'),
  (req, res, next) => uploadLogoController.uploadLogo(req, res, next)
);
router.patch(
  '/delete-logo/:companyId',
  checkIfAUthenticated,
  isCompany,
  (req, res, next) => uploadLogoController.deleteLogo(req, res, next)
);
router.patch(
  '/upload-document/:companyId',
  checkIfAUthenticated,
  isCompany,
  upload.single('verificationDocument'),
  (req, res, next) => uploadDocumentController.uploadDocument(req, res, next)
);
router.patch(
  '/delete-document/:companyId',
  checkIfAUthenticated,
  isCompany,
  (req, res, next) => uploadDocumentController.deleteDocument(req, res, next)
);
router.patch(
  '/:companyId/add-member',
  checkIfAUthenticated,
  isCompany,
  (req, res, next) => addMemberController.addMember(req, res, next)
);
router.delete(
  '/:companyId/remove-member/:userId',
  checkIfAUthenticated,
  isCompany,
  (req, res, next) => addMemberController.removeMember(req, res, next)
);
router.get(
  '/:companyId/all-members',
  checkIfAUthenticated,
  isCompany,
  (req, res, next) => addMemberController.getAllMembers(req, res, next)
);
router.patch(
  '/update-basic-detail/:companyId',
  checkIfAUthenticated,
  isCompany,
  companyEditValidationRules,
  validateRequest,
  (req: Request, res: Response, next: NextFunction) =>
    manageProfileController.updatedCompanyDetails(req, res, next)
);
router.get(
  '/company-profile-details/:companyId',
  checkIfAUthenticated,
  isCompany,
  (req, res, next) => manageProfileController.getCompanyProfile(req, res, next)
);
router.patch(
  '/complete-profile/:companyId',
  checkIfAUthenticated,
  isCompany,
  (req, res, next) =>
    manageProfileController.updatedCompanyProfile(req, res, next)
);
//job posts
router.post(
  '/job-post/:companyId/:userId',
  checkIfAUthenticated,
  isCompany,
  (req, res, next) => jobPostController.createJobPost(req, res, next)
);
router.get(
  '/all-job-posts/:companyId',
  checkIfAUthenticated,
  isCompany,
  (req, res, next) => jobPostController.getAllJobPost(req, res, next)
);

//job applications
router.patch(
  '/job-application-status/:applicationId',
  checkIfAUthenticated,
  isCompany,
  (req, res, next) =>
    companyJobApplicationController.updateApplicationStatus(req, res, next)
);
router.get(
  '/all-applications/:companyId',
  checkIfAUthenticated,
  isCompany,
  (req, res, next) =>
    companyJobApplicationController.getAllJobApplicationForCompany(
      req,
      res,
      next
    )
);
export default router;
