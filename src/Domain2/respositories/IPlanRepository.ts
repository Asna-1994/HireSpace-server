import { IPlansDTO } from "../../Application2/dto/Plans/PlansDTO";
import { IPlans } from "../entities/AppPlans";


export interface IPlanRepository {
  createPlan(planData: Partial<IPlans>): Promise<IPlansDTO>;
  getPlanById(planId: string): Promise<IPlansDTO | null>;
  updatePlan(id: string, planData: Partial<IPlans>): Promise<IPlansDTO | null>;
  getAllPlans(filter: object, skip?: number, limit?: number): Promise<IPlansDTO[]>;
  countPlans(filter: object): Promise<number>;
  deletePlan(planId: string): Promise<IPlansDTO | null>;
}
