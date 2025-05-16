import { Router } from "express";
import { planController } from "../../Containers/PlanContainer";

const router = Router();

// Admin route to create plans
router.post('/create', planController.createPlan);
router.get('/all-plans',planController.getAllPlans);
// router.patch('/edit/:planId')
router.delete('/delete/:planId', planController.deletePlan);

export default router;
