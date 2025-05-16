import { Router } from 'express';
import { certificateController, educationController, experienceController, manageProfileController, skillsController, userAuthController, userFileUploadController, userJobApplicationController, userJobPostController } from '../../Containers/UserContainer';
import { authenticationMiddleware } from '../../Containers/AuthContainer';
import { upload } from '../../Infrastructure2/config/cloudinaryConfig';
import { addEducationValidationRules, editUserProfileValidationRules, validateExperienceData } from '../middleware/validationMiddlewares/userProfileValidation';
import { userSignupValidationRules, validateRequest } from '../middleware/validationMiddlewares/signupValidation';



const router = Router();

// Auth routes
router.post('/login', userAuthController.login);

router.post('/verify-otp',
 userAuthController.verifyOtp
);
router.post( '/signup',userSignupValidationRules,
     validateRequest, userAuthController.signup
);


router.post('/resend-otp', 
 userAuthController.resendOtp
);
router.post('/google/callback', 
 userAuthController.googleSignIn
);
router.patch('/forgot-password', 
 userAuthController.changePassword
);
router.patch(
  '/upload-profile-image/:userId',
  authenticationMiddleware.checkIfAuthenticated,
  upload.single('profilePhoto'),
  
   userFileUploadController.uploadProfilePicture
);
router.patch(
  '/update-basic-detail/:userId',
  authenticationMiddleware.checkIfAuthenticated,
  editUserProfileValidationRules,
  validateRequest,
   manageProfileController.editBasicDetails
);
router.patch(
  '/:userId/add-education',
  authenticationMiddleware.checkIfAuthenticated,
  addEducationValidationRules,
  validateRequest,
   educationController.addEducation
);
router.get(
  '/:userId/all-education',
  authenticationMiddleware.checkIfAuthenticated,
  
   educationController.getAllEducation
);
router.delete(
  '/:userId/education/:educationId',
  authenticationMiddleware.checkIfAuthenticated,
  
   educationController.deleteEducation
);
router.get(
  '/:userId/complete-profile',
  authenticationMiddleware.checkIfAuthenticated,
  
   manageProfileController.getJobSeekerProfile
);
// //job seeker profile
router.patch(
  '/upload-resume/:userId',
  authenticationMiddleware.checkIfAuthenticated,
  upload.single('resume'),
  userFileUploadController.uploadResume
);
router.get('/get-resume/:userId', authenticationMiddleware.checkIfAuthenticated,
     
 manageProfileController.getResume
);
router.patch('/delete-resume/:userId', authenticationMiddleware.checkIfAuthenticated,
     
 userFileUploadController.deleteResume
);
router.delete(
  '/delete-profile-image/:userId',
  authenticationMiddleware.checkIfAuthenticated,
  
   userFileUploadController.deleteProfilePicture
);
router.patch(
  '/add-or-update-experience/:userId',
  authenticationMiddleware.checkIfAuthenticated,
  validateExperienceData,
  validateRequest,
   experienceController.addWorkExperience
);
router.patch(
  '/add-or-update-skills/:userId',
  authenticationMiddleware.checkIfAuthenticated,
  
   skillsController.addSkills
);
router.get(
  '/:userId/all-experience',
  authenticationMiddleware.checkIfAuthenticated,
  
   experienceController.getAllExperience
);
router.delete(
  '/:userId/experience/:experienceId',
  authenticationMiddleware.checkIfAuthenticated,
  
   experienceController.deleteExperience
);
router.get(
  '/:userId/all-skills',
  authenticationMiddleware.checkIfAuthenticated,
  
   skillsController.getAllSkills
);
router.get(
  '/:userId/all-certificates',
  authenticationMiddleware.checkIfAuthenticated,
  
   certificateController.getAllCertificates
);
router.delete(
  '/:userId/delete-skills',
  authenticationMiddleware.checkIfAuthenticated,
  
  skillsController.deleteSkill
);
router.patch(
  '/add-or-update-certificates/:userId',
  authenticationMiddleware.checkIfAuthenticated,
  
   certificateController.addOrEditCertificates
);
router.patch(
  '/profile-tag-line/:userId',
  authenticationMiddleware.checkIfAuthenticated,
  
   manageProfileController.addTagline
);
router.delete(
  '/:userId/certificates/:certificateId',
  authenticationMiddleware.checkIfAuthenticated,
  
  certificateController.deleteCertificate
);

// //jobPosts
router.get(
  '/all-job-posts',
  authenticationMiddleware.checkIfAuthenticated,
  
   userJobPostController.getAllJobPostForUser
);
router.get(
  '/all-saved-job-posts/:userId',
  authenticationMiddleware.checkIfAuthenticated,
  
   userJobPostController.getSavedJobPosts
);
router.patch(
  '/save-job-post/:userId/:jobPostId',
  authenticationMiddleware.checkIfAuthenticated,
  
   manageProfileController.saveJob
);
router.post(
  '/report-spam',
  authenticationMiddleware.checkIfAuthenticated,
  
   userJobPostController.reportSpam
);

// //job applications
router.post(
  '/apply-for-job/:userId/:jobPostId/:companyId',
  authenticationMiddleware.checkIfAuthenticated,
  
   userJobApplicationController. applyForJob
);
router.get(
  '/all-job-applications/:userId',
  authenticationMiddleware.checkIfAuthenticated,
  
   userJobApplicationController.getAllJobApplicationForUser
);
router.get(
  '/:userId/statics',
  authenticationMiddleware.checkIfAuthenticated,
  
   userJobApplicationController.getHomeStatsForUser
);


export default router;