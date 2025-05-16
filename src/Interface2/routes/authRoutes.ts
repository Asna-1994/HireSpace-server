import express from 'express';
import { authController } from '../../Containers/AuthContainer';




const router = express.Router();


router.post('/refresh', (req, res, next) => authController.refreshToken(req, res, next));
router.post('/logout', (req, res, next) => authController.logout(req, res, next));

export default router;
