import { Router } from 'express';
import { PlanController } from '../controller/plansController/managePlansController';

const router = Router();

// Admin route to create plans
router.post('/create', PlanController.createPlan);
router.get('/all-plans', PlanController.getAllPlans);
// router.patch('/edit/:planId')
router.delete('/delete/:planId', PlanController.deletePlan);

export default router;
