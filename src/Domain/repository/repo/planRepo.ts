import { Plans } from "../../entities/AppPlans";

export interface PlanRepository {
  createPlan(planData: Partial<Plans>): Promise<Plans>;
  getPlanById(planId: string): Promise<Plans | null>;
  updatePlan(id: string, planData: Partial<Plans>): Promise<Plans | null>;
  getAllPlans(filter : object,skip? :number,limit? : number): Promise<Plans[]>;
   countPlans(filter: object): Promise<number> 
   deletePlan(planId: string): Promise<Plans | null>
}
