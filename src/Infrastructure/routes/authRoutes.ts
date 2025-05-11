import { authContainer } from './../containers/authDependencyContainer';
import express from 'express';




const router = express.Router();



router.post('/refresh', (req, res, next) => authContainer.refreshController.refreshToken(req, res, next));
router.post('/logout', (req, res, next) => authContainer.logoutController.logout(req, res, next));

export default router;
