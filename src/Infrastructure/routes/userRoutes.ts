import { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import {
  validateRequest,
  userSignupValidationRules,
} from '../middleware/validationMiddlewares/signupValidation';
import { upload } from '../config/cloudinaryConfig';
import {
  addEducationValidationRules,
  editUserProfileValidationRules,
  validateExperienceData,
} from '../middleware/validationMiddlewares/userProfileValidation';
import { checkIfAUthenticated } from '../middleware/authenticationMiddleware';
import { dependencyContainer } from '../containers/userDependencyContainer';



const router = Router();

router.post('/verify-otp', (req, res, next) =>
  dependencyContainer.verifyOtpController.verifyOtp(req, res, next)
);
router.post(
  '/signup',
  userSignupValidationRules,
  validateRequest,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.signupController.signup(req, res, next)
);
router.post('/login', (req, res, next) =>
  dependencyContainer.loginController.login(req, res, next)
);

router.post('/resend-otp', (req, res, next) =>
  dependencyContainer.resendOtpController.resendOtp(req, res, next)
);
router.post('/google/callback', (req, res, next) =>
  dependencyContainer.googleSigInController.googleSignIn(req, res, next)
);
router.patch('/forgot-password', (req, res, next) =>
  dependencyContainer.forgotPasswordController.changePassword(req, res, next)
);
router.patch(
  '/upload-profile-image/:userId',
  checkIfAUthenticated,
  upload.single('profilePhoto'),
  (req, res, next) =>
    dependencyContainer.uploadProfilePhotoController.uploadProfilePicture(req, res, next)
);
router.patch(
  '/update-basic-detail/:userId',
  checkIfAUthenticated,
  editUserProfileValidationRules,
  validateRequest,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.uploadProfilePhotoController.editBasicDetails(req, res, next)
);
router.patch(
  '/:userId/add-education',
  checkIfAUthenticated,
  addEducationValidationRules,
  validateRequest,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.manageJobSeekerProfileController.addEducation(req, res, next)
);
router.get(
  '/:userId/all-education',
  checkIfAUthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.manageJobSeekerProfileController.getAllEducation(req, res, next)
);
router.delete(
  '/:userId/education/:educationId',
  checkIfAUthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.manageJobSeekerProfileController.deleteEducation(req, res, next)
);
router.get(
  '/:userId/complete-profile',
  checkIfAUthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.manageJobSeekerProfileController.getJobSeekerProfile(req, res, next)
);
//job seeker profile
router.patch(
  '/upload-resume/:userId',
  checkIfAUthenticated,
  upload.single('resume'),
  (req, res, next) => dependencyContainer.uploadProfilePhotoController.uploadResume(req, res, next)
);
router.get('/get-resume/:userId', checkIfAUthenticated, (req, res, next) =>
  dependencyContainer.uploadProfilePhotoController.getResume(req, res, next)
);
router.patch('/delete-resume/:userId', checkIfAUthenticated, (req, res, next) =>
  dependencyContainer.uploadProfilePhotoController.deleteResume(req, res, next)
);
router.delete(
  '/delete-profile-image/:userId',
  checkIfAUthenticated,
  (req, res, next) =>
    dependencyContainer.uploadProfilePhotoController.deleteProfilePicture(req, res, next)
);
router.patch(
  '/add-or-update-experience/:userId',
  checkIfAUthenticated,
  validateExperienceData,
  validateRequest,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.manageJobSeekerProfileController.addWorkExperience(req, res, next)
);
router.patch(
  '/add-or-update-skills/:userId',
  checkIfAUthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.manageJobSeekerProfileController.addSkills(req, res, next)
);
router.get(
  '/:userId/all-experience',
  checkIfAUthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.manageJobSeekerProfileController.getAllExperience(req, res, next)
);
router.delete(
  '/:userId/experience/:experienceId',
  checkIfAUthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.manageJobSeekerProfileController.deleteExperience(req, res, next)
);
router.get(
  '/:userId/all-skills',
  checkIfAUthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.manageJobSeekerProfileController.getAllSkills(req, res, next)
);
router.get(
  '/:userId/all-certificates',
  checkIfAUthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.manageJobSeekerProfileController.getAllCertificates(req, res, next)
);
router.delete(
  '/:userId/delete-skills',
  checkIfAUthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.manageJobSeekerProfileController.deleteSkill(req, res, next)
);
router.patch(
  '/add-or-update-certificates/:userId',
  checkIfAUthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.manageJobSeekerProfileController.addOrEditCertificates(req, res, next)
);
router.patch(
  '/profile-tag-line/:userId',
  checkIfAUthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.manageJobSeekerProfileController.addTagline(req, res, next)
);
router.delete(
  '/:userId/certificates/:certificateId',
  checkIfAUthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.manageJobSeekerProfileController.deleteCertificate(req, res, next)
);

//jobPosts
router.get(
  '/all-job-posts',
  checkIfAUthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.userJobPostController.getAllJobPostForUser(req, res, next)
);
router.get(
  '/all-saved-job-posts/:userId',
  checkIfAUthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.userJobPostController.getSavedJobPosts(req, res, next)
);
router.patch(
  '/save-job-post/:userId/:jobPostId',
  checkIfAUthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.manageJobSeekerProfileController.saveJob(req, res, next)
);
router.post(
  '/report-spam',
  checkIfAUthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.userJobPostController.reportSpam(req, res, next)
);

//job applications
router.post(
  '/apply-for-job/:userId/:jobPostId/:companyId',
  checkIfAUthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.userJobApplicationController.applyForJob(req, res, next)
);
router.get(
  '/all-job-applications/:userId',
  checkIfAUthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.userJobApplicationController.getAllJobApplicationForUser(req, res, next)
);
router.get(
  '/:userId/statics',
  checkIfAUthenticated,
  (req: Request, res: Response, next: NextFunction) =>
    dependencyContainer.userJobApplicationController.getHomeStatsForUser(req, res, next)
);
export default router;
