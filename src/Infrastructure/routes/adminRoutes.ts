import { DashboardUseCase } from '../../Application/usecases/admin/dashBoardUseCase';
import { AdminAuthController } from './../controller/adminController/AdminAuthController';
import { BlockOrUnblockCompanyController } from './../controller/adminController/blockOrUnblockCompanyController';
import { GetAllUsersController } from './../controller/adminController/getAlluserController';
import { Router } from 'express';
import { GetAllUsersUseCase } from '../../Application/usecases/admin/getAllUsersUsecase';
import { UserRepositoryImpl } from '../../Domain/repository/implementation/userRepositoryImpl';
import {
  checkIfAUthenticated,
  isAdmin,
} from '../middleware/authenticationMiddleware';
import { CompanyRepositoryImpl } from '../../Domain/repository/implementation/companyRepoImpl';
import { GetAllCompaniesUseCase } from '../../Application/usecases/admin/getAllCompaniesUsecase';
import { GetAllCompanyController } from '../controller/adminController/getAllCompanyController';
import { BlockOrUnblockUserController } from '../controller/adminController/blockOrUnblockUserController';
import { BlockOrUnblockUserUseCase } from '../../Application/usecases/admin/blockOrUnblockUser';
import { BlockOrUnblockCompanyUseCase } from '../../Application/usecases/admin/blockOrUnblockCompany';
import { AdminAuthUseCase } from '../../Application/usecases/admin/adminAuthUseCase';
import { SpamRepositoryImpl } from '../../Domain/repository/implementation/spamRepoImpl';
import { JobPostRepositoryImpl } from '../../Domain/repository/implementation/JobPostRepoImpl';

import { DashboardController } from '../controller/adminController/dashBoardController';

import { JobApplicationRepositoryImpl } from '../../Domain/repository/implementation/jobApplicationRepoImpl';

const userRepository = new UserRepositoryImpl();
const companyRepository = new CompanyRepositoryImpl();
const spamRepository = new SpamRepositoryImpl();
const jobPostRepository = new JobPostRepositoryImpl();
const jobApplicationRepository = new JobApplicationRepositoryImpl();

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

const router = Router();
router.post('/login', (req, res, next) =>
  adminAuthController.login(req, res, next)
);
router.get('/all-users', checkIfAUthenticated, (req, res, next) =>
  getAllUsersController.getAllUsers(req, res, next)
);
router.get('/all-companies', checkIfAUthenticated, (req, res, next) =>
  getAllCompanyController.getAllCompanies(req, res, next)
);
router.patch(
  '/block-or-unblock-user/:userId/:action',
  checkIfAUthenticated,
  isAdmin,
  (req, res, next) =>
    blockOrUnblockUserController.blockOrUnblock(req, res, next)
);
router.patch(
  '/block-or-unblock-company/:companyId/:action',
  checkIfAUthenticated,
  isAdmin,
  (req, res, next) =>
    blockOrUnblockCompanyController.blockOrUnblock(req, res, next)
);
router.patch(
  '/:companyId/verify-company',
  checkIfAUthenticated,
  isAdmin,
  (req, res, next) =>
    blockOrUnblockCompanyController.verifyCompany(req, res, next)
);
router.get('/premium-users', checkIfAUthenticated, isAdmin, (req, res, next) =>
  getAllUsersController.getPremiumUsers(req, res, next)
);
router.get('/spam-reports', checkIfAUthenticated, isAdmin, (req, res, next) =>
  getAllUsersController.getSpamReports(req, res, next)
);

router.get(
  '/dashboard-stats',
  checkIfAUthenticated,
  isAdmin,
  (req, res, next) => dashboardController.getDashboardStats(req, res, next)
);

export default router;
