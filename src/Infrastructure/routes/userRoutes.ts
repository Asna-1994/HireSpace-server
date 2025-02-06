import { UserJobApplicationController} from './../controller/userController/jobApplicationControler';
import { UserJobApplicationUseCase } from './../../Application/usecases/user/userJobApplicationUseCase';
import { JobApplicationRepository } from '../../Domain/repository/repo/jobApplicationRepository';
import { JobApplicationRepositoryImpl } from '../../Domain/repository/implementation/jobApplicationRepoImpl';
import { UserJobPostController } from './../controller/userController/userJobPostController';
import { UserJobPostUseCase } from './../../Application/usecases/user/userJobPostUseCase';
import { ManageProfileUseCase } from './../../Application/usecases/user/manageProfileUsecase';
import { UploadProfilePhotoController } from './../controller/userController/UploadProfilePhotoController';
import { FileUploadUseCase } from './../../Application/usecases/shared/fileUploadUsecase';
import { GoogleSignInController } from './../controller/userController/googleSigninController';
import { NextFunction, Request, Response } from 'express';
import { ResendOtpUseCase } from './../../Application/usecases/user/resendOtpUsecase';
import { Router } from 'express';
import { VerifyOtpController } from '../controller/userController/verifyOtpController';
import { VerifyOtpUseCase } from '../../Application/usecases/user/otpVerificationUsecase';
import { SignupController } from '../controller/userController/singupController';
import { SignupUseCase } from '../../Application/usecases/user/signupUsecase';
import { sendOtpEmail, sendOtpSms } from '../email/emailService';
import { TempUserRepositoryImpl } from '../../Domain/repository/implementation/tempUserRepositoryImpl';
import { UserRepositoryImpl } from '../../Domain/repository/implementation/userRepositoryImpl';
import { LoginUseCase } from '../../Application/usecases/user/loginUsecase';
import { LoginController } from '../controller/userController/loginController';
import { LogoutController } from '../controller/userController/logoutController';
import { ResendOtpController } from '../controller/userController/resendOtpConstroller';
import {  validateRequest , userSignupValidationRules} from '../middleware/validationMiddlewares/signupValidation';
import { GoogleSignInUseCase } from '../../Application/usecases/user/googleSiginUsecase';
import { ForgotPasswordUseCase } from '../../Application/usecases/user/forgotPasswordUseCase';
import { ForgotPasswordController } from '../controller/userController/forgotPasswordController';
import { upload } from '../config/cloudinaryConfig';
import { addEducationValidationRules, editUserProfileValidationRules, validateExperienceData } from '../middleware/validationMiddlewares/userProfileValidation';
import { JobSeekerProfileImpl } from '../../Domain/repository/implementation/JobSeekerProfileImpl';
import { ManageJobSeekerProfileController } from '../controller/userController/manageProfileController';
import { JobPostRepositoryImpl } from '../../Domain/repository/implementation/JobPostRepoImpl';
import { checkIfAUthenticated } from '../middleware/authenticationMiddleware';
import { SpamRepositoryImpl } from '../../Domain/repository/implementation/spamRepoImpl';





const tempUserRepository = new TempUserRepositoryImpl();
const userRepository = new UserRepositoryImpl();
const jobSeekerProfileRepository =  new JobSeekerProfileImpl()
const jobPostRepository = new JobPostRepositoryImpl()
const jobApplicationRepository  = new JobApplicationRepositoryImpl()
const spamRepository  = new SpamRepositoryImpl()


const verifyOtpUseCase = new VerifyOtpUseCase(tempUserRepository, userRepository, jobSeekerProfileRepository);
const verifyOtpController = new VerifyOtpController(verifyOtpUseCase);

const signupUseCase = new SignupUseCase(tempUserRepository, userRepository,sendOtpEmail, sendOtpSms);
const signupController = new SignupController(signupUseCase);

const loginUseCase = new LoginUseCase(userRepository, jobSeekerProfileRepository);
const loginController = new LoginController(loginUseCase);

const logoutController = new LogoutController();

const resendOtpUseCase = new ResendOtpUseCase(tempUserRepository, sendOtpEmail);
const resendOtpController = new ResendOtpController(resendOtpUseCase);

const googleSignInUseCase = new GoogleSignInUseCase(userRepository, jobSeekerProfileRepository);
const googleSigInController = new GoogleSignInController(googleSignInUseCase);

const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository);
const forgotPasswordController = new ForgotPasswordController(forgotPasswordUseCase);

const  fileUploadUseCase = new FileUploadUseCase()
const uploadProfilePhotoController = new UploadProfilePhotoController(fileUploadUseCase, userRepository, jobSeekerProfileRepository)

const manageProfileUseCase = new ManageProfileUseCase(jobSeekerProfileRepository, userRepository)
const manageJobSeekerProfileController = new ManageJobSeekerProfileController(manageProfileUseCase)

const userJobPostUseCase = new UserJobPostUseCase(jobPostRepository, userRepository, spamRepository)
const userJobPostController = new UserJobPostController(userJobPostUseCase)

const userJobApplicationUseCase = new UserJobApplicationUseCase(jobApplicationRepository, jobSeekerProfileRepository, userRepository,jobPostRepository)
const userJobApplicationController = new UserJobApplicationController(userJobApplicationUseCase)



const router = Router();

router.post('/verify-otp', (req, res, next) => verifyOtpController.verifyOtp(req, res, next));
router.post("/signup",userSignupValidationRules,validateRequest,  (req: Request, res: Response, next: NextFunction) => signupController.signup(req, res, next));
router.post('/login', (req, res, next) => loginController.login(req, res, next));
router.post('/logout', (req, res, next) => logoutController.logout(req, res, next));
router.post('/resend-otp', (req, res, next) => resendOtpController.resendOtp(req, res, next));
router.post('/google/callback', (req, res, next) => googleSigInController.googleSignIn(req, res, next));
router.patch('/forgot-password', (req, res, next) => forgotPasswordController.changePassword(req, res, next));
router.patch('/upload-profile-image/:userId',checkIfAUthenticated,  upload.single("profilePhoto"), (req, res, next) =>uploadProfilePhotoController.uploadProfilePicture(req, res, next));
router.patch('/update-basic-detail/:userId',checkIfAUthenticated, editUserProfileValidationRules,validateRequest,(req: Request, res: Response, next: NextFunction) => uploadProfilePhotoController.editBasicDetails(req, res, next));
router.patch('/:userId/add-education',checkIfAUthenticated, addEducationValidationRules,validateRequest,(req: Request, res: Response, next: NextFunction) => manageJobSeekerProfileController.addEducation(req, res, next))
router.get('/:userId/all-education',checkIfAUthenticated,(req: Request, res: Response, next: NextFunction) => manageJobSeekerProfileController.getAllEducation(req, res, next))
router.delete('/:userId/education/:educationId',checkIfAUthenticated,(req: Request, res: Response, next: NextFunction) => manageJobSeekerProfileController.deleteEducation(req, res, next))
router.get('/:userId/complete-profile',checkIfAUthenticated,(req: Request, res: Response, next: NextFunction) => manageJobSeekerProfileController.getJobSeekerProfile(req, res, next))
//job seeker profile
router.patch('/upload-resume/:userId',checkIfAUthenticated,  upload.single("resume"), (req, res, next) =>uploadProfilePhotoController.uploadResume(req, res, next));
router.get('/get-resume/:userId',checkIfAUthenticated,  (req, res, next) =>uploadProfilePhotoController.getResume(req, res, next));
router.patch('/delete-resume/:userId',checkIfAUthenticated,  (req, res, next) =>uploadProfilePhotoController.deleteResume(req, res, next));
router.delete('/delete-profile-image/:userId',checkIfAUthenticated,  (req, res, next) =>uploadProfilePhotoController.deleteProfilePicture(req, res, next));
router.patch('/add-or-update-experience/:userId',checkIfAUthenticated,validateExperienceData,validateRequest,(req: Request, res: Response, next: NextFunction) => manageJobSeekerProfileController.addWorkExperience(req, res, next));
router.patch('/add-or-update-skills/:userId',checkIfAUthenticated,(req: Request, res: Response, next: NextFunction) => manageJobSeekerProfileController.addSkills(req, res, next));
router.get('/:userId/all-experience',checkIfAUthenticated,(req: Request, res: Response, next: NextFunction) => manageJobSeekerProfileController.getAllExperience(req, res, next))
router.delete('/:userId/experience/:experienceId',checkIfAUthenticated,(req: Request, res: Response, next: NextFunction) => manageJobSeekerProfileController.deleteExperience(req, res, next))
router.get('/:userId/all-skills',checkIfAUthenticated,(req: Request, res: Response, next: NextFunction) => manageJobSeekerProfileController.getAllSkills(req, res, next))
router.get('/:userId/all-certificates',checkIfAUthenticated,(req: Request, res: Response, next: NextFunction) => manageJobSeekerProfileController.getAllCertificates(req, res, next))
router.delete('/:userId/delete-skills',checkIfAUthenticated,(req: Request, res: Response, next: NextFunction) => manageJobSeekerProfileController.deleteSkill(req, res, next))
router.patch('/add-or-update-certificates/:userId',checkIfAUthenticated,(req: Request, res: Response, next: NextFunction) => manageJobSeekerProfileController.addOrEditCertificates(req, res, next));
router.patch('/profile-tag-line/:userId',checkIfAUthenticated,(req: Request, res: Response, next: NextFunction) => manageJobSeekerProfileController.addTagline(req, res, next));
router.delete('/:userId/certificates/:certificateId',checkIfAUthenticated,(req: Request, res: Response, next: NextFunction) => manageJobSeekerProfileController.deleteCertificate(req, res, next))


//jobPosts
router.get('/all-job-posts',checkIfAUthenticated,(req: Request, res: Response, next: NextFunction) => userJobPostController.getAllJobPostForUser(req, res, next))
router.get('/all-saved-job-posts/:userId',checkIfAUthenticated,(req: Request, res: Response, next: NextFunction) => userJobPostController.getSavedJobPosts(req, res, next))
router.patch('/save-job-post/:userId/:jobPostId',checkIfAUthenticated,(req: Request, res: Response, next: NextFunction) => manageJobSeekerProfileController.saveJob(req, res, next))
router.post('/report-spam',checkIfAUthenticated,(req: Request, res: Response, next: NextFunction) => userJobPostController.reportSpam(req, res, next))

//job applications
router.post('/apply-for-job/:userId/:jobPostId/:companyId',checkIfAUthenticated,(req: Request, res: Response, next: NextFunction) => userJobApplicationController.applyForJob(req, res, next))
router.get('/all-job-applications/:userId',checkIfAUthenticated,(req: Request, res: Response, next: NextFunction) => userJobApplicationController.getAllJobApplicationForUser(req, res, next))
router.get('/:userId/statics',checkIfAUthenticated,(req: Request, res: Response, next: NextFunction) => userJobApplicationController.getHomeStatsForUser(req, res, next))
export default router;
