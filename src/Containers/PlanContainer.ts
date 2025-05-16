import { ManagePlanUseCase } from "../Application2/usecases/plans/plansUseCase";
import { PlanRepository } from "../Infrastructure2/persistance/repositories/PlanRepository";
import { PlanController } from "../Interface2/controller/PlanController/ManagePlanController";




const planRepository = new PlanRepository()



const planUseCase = new ManagePlanUseCase(planRepository)


const planController = new PlanController(planUseCase)



export  {planController};
