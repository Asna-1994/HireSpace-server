
import { Router } from 'express';
import { adminAuthController, blockOrUnblockCompanyController, blockOrUnblockUserController, dashBoardController, getAllCompaniesController, getAllUsersController } from '../../Containers/AdminContainer';
import { authenticationMiddleware } from '../../Containers/AuthContainer';


const router = Router();
router.post('/login', (req, res, next) =>
  adminAuthController.login(req, res, next)
);
router.get('/all-users', authenticationMiddleware.checkIfAuthenticated, (req, res, next) =>
  getAllUsersController.getAllUsers(req, res, next)
);
router.get('/all-companies',authenticationMiddleware.checkIfAuthenticated, (req, res, next) =>
 getAllCompaniesController.getAllCompanies(req, res, next)
);
router.patch(
  '/block-or-unblock-user/:userId/:action',
  authenticationMiddleware.checkIfAuthenticated,
  authenticationMiddleware.isAdmin,
  (req, res, next) =>
    blockOrUnblockUserController.blockOrUnblock(req, res, next)
);
router.patch(
  '/block-or-unblock-company/:companyId/:action',
  authenticationMiddleware.checkIfAuthenticated,
authenticationMiddleware.isAdmin,
  (req, res, next) =>
    blockOrUnblockCompanyController.blockOrUnblock(req, res, next)
);
router.patch(
  '/:companyId/verify-company',
  authenticationMiddleware.checkIfAuthenticated,
authenticationMiddleware.isAdmin,
  (req, res, next) =>
    blockOrUnblockCompanyController.verifyCompany(req, res, next)
);
router.get('/premium-users', authenticationMiddleware.checkIfAuthenticated, authenticationMiddleware.isAdmin, (req, res, next) =>
 getAllUsersController.getPremiumUsers(req, res, next)
);
router.get('/spam-reports', authenticationMiddleware.checkIfAuthenticated, authenticationMiddleware.isAdmin, (req, res, next) =>
  getAllUsersController.getSpamReports(req, res, next)
);

router.get(
  '/dashboard-stats',
  authenticationMiddleware.checkIfAuthenticated,
authenticationMiddleware.isAdmin,
  (req, res, next) =>dashBoardController.getDashboardStats(req, res, next)
);

export default router;
