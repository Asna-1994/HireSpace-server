import { Router } from 'express';
import { companyLoginController, forgotPasswordController, jobApplicationController, jobPostController, manageDocumentController, manageLogoController, manageMemberController, manageProfileController, otpVerificationController, resendOtpController, signupController } from '../../Containers/CompanyContainer';
import { authenticationMiddleware } from '../../Containers/AuthContainer';
import { companyEditValidationRules, companySignupValidationRules, validateRequest } from '../middleware/validationMiddlewares/signupValidation';
import { upload } from '../../Infrastructure2/config/cloudinaryConfig';





const router = Router();

router.post('/verify-otp',  
  otpVerificationController.verifyOtp
);
router.post(
  '/signup',
  companySignupValidationRules,
  validateRequest,
  signupController.signup
);
router.post('/login',  
  companyLoginController.login
);

router.post('/resend-otp',  resendOtpController.resendOtp);
router.patch('/forgot-password',  forgotPasswordController.changePassword);
router.patch(
  '/upload-company-logo/:companyId',
  authenticationMiddleware.checkIfAuthenticated,
  authenticationMiddleware.isCompany,
  upload.single('companyLogo'),
   manageLogoController.uploadLogo
);
router.patch(
  '/delete-logo/:companyId',
  authenticationMiddleware.checkIfAuthenticated,
  authenticationMiddleware.isCompany,
  manageLogoController.deleteLogo
);
router.patch(
  '/upload-document/:companyId',
  authenticationMiddleware.checkIfAuthenticated,
  authenticationMiddleware.isCompany,
  upload.single('verificationDocument'),
   manageDocumentController.uploadDocument
);
router.patch(
  '/delete-document/:companyId',
  authenticationMiddleware.checkIfAuthenticated,
  authenticationMiddleware.isCompany,
   manageDocumentController.deleteDocument
);
router.patch(
  '/:companyId/add-member',
  authenticationMiddleware.checkIfAuthenticated,
  authenticationMiddleware.isCompany,
   manageMemberController.addMember
);
router.delete(
  '/:companyId/remove-member/:userId',
  authenticationMiddleware.checkIfAuthenticated,
  authenticationMiddleware.isCompany,
   manageMemberController.removeMember
);
router.get(
  '/:companyId/all-members',
  authenticationMiddleware.checkIfAuthenticated,
  authenticationMiddleware.isCompany,
   manageMemberController.getAllMembers
);
router.patch(
  '/update-basic-detail/:companyId',
  authenticationMiddleware.checkIfAuthenticated,
  authenticationMiddleware.isCompany,
  companyEditValidationRules,
  validateRequest,
    manageProfileController.updatedCompanyDetails
);
router.get(
  '/company-profile-details/:companyId',
  authenticationMiddleware.checkIfAuthenticated,
  authenticationMiddleware.isCompany,
   manageProfileController.getCompanyProfile
);
router.patch(
  '/complete-profile/:companyId',
  authenticationMiddleware.checkIfAuthenticated,
  authenticationMiddleware.isCompany,
   
    manageProfileController.updatedCompanyProfile
);
//job posts
router.post(
  '/job-post/:companyId/:userId',
  authenticationMiddleware.checkIfAuthenticated,
  authenticationMiddleware.isCompany,
   jobPostController.createJobPost
);
router.get(
  '/all-job-posts/:companyId',
  authenticationMiddleware.checkIfAuthenticated,
  authenticationMiddleware.isCompany,
   jobPostController.getAllJobPost
);

router.delete(
  '/job-post/:jobPostId',
  authenticationMiddleware.checkIfAuthenticated,
  authenticationMiddleware.isCompany,
   jobPostController.deleteJobPost
);

   

//job applications
router.patch(
  '/job-application-status/:applicationId',
  authenticationMiddleware.checkIfAuthenticated,
  authenticationMiddleware.isCompany,
   
    jobApplicationController.updateApplicationStatus
);
router.get(
  '/all-applications/:companyId',
  authenticationMiddleware.checkIfAuthenticated,
  authenticationMiddleware.isCompany,
  
    jobApplicationController.getAllJobApplicationForCompany
);
export default router;
