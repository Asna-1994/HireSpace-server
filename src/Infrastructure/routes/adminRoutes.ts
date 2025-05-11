import { dependencyContainer } from './../containers/userDependencyContainer';
import { Router } from 'express';
import {
  checkIfAUthenticated,
  isAdmin,
} from '../middleware/authenticationMiddleware';


const router = Router();
router.post('/login', (req, res, next) =>
  dependencyContainer.adminAuthController.login(req, res, next)
);
router.get('/all-users', checkIfAUthenticated, (req, res, next) =>
  dependencyContainer.getAllUsersController.getAllUsers(req, res, next)
);
router.get('/all-companies', checkIfAUthenticated, (req, res, next) =>
  dependencyContainer.getAllCompanyController.getAllCompanies(req, res, next)
);
router.patch(
  '/block-or-unblock-user/:userId/:action',
  checkIfAUthenticated,
  isAdmin,
  (req, res, next) =>
    dependencyContainer.blockOrUnblockUserController.blockOrUnblock(req, res, next)
);
router.patch(
  '/block-or-unblock-company/:companyId/:action',
  checkIfAUthenticated,
  isAdmin,
  (req, res, next) =>
    dependencyContainer.blockOrUnblockCompanyController.blockOrUnblock(req, res, next)
);
router.patch(
  '/:companyId/verify-company',
  checkIfAUthenticated,
  isAdmin,
  (req, res, next) =>
    dependencyContainer.blockOrUnblockCompanyController.verifyCompany(req, res, next)
);
router.get('/premium-users', checkIfAUthenticated, isAdmin, (req, res, next) =>
  dependencyContainer.getAllUsersController.getPremiumUsers(req, res, next)
);
router.get('/spam-reports', checkIfAUthenticated, isAdmin, (req, res, next) =>
  dependencyContainer.getAllUsersController.getSpamReports(req, res, next)
);

router.get(
  '/dashboard-stats',
  checkIfAUthenticated,
  isAdmin,
  (req, res, next) => dependencyContainer.dashboardController.getDashboardStats(req, res, next)
);

export default router;
