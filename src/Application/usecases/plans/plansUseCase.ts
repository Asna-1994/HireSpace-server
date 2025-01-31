import { PlanRepository } from '../../../Domain/repository/repo/planRepo';
import { Plans } from '../../../Domain/entities/AppPlans';
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';

export class ManagePlanUseCase {
  constructor(private planRepository: PlanRepository) {}

  async createPlan(planData: Partial<Plans>): Promise<Plans> {
    const { planType, price, userType, durationInDays, features } = planData;

    if (!planType || !price  || !durationInDays || !features) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST,'Missing required fields');
    }

    return await this.planRepository.createPlan(planData);
  }


  async updatePlan(planId: string, planData: any): Promise<any> {

    const updatedPlan = await this.planRepository.updatePlan(planId, planData);
    if (!updatedPlan) {
      throw new CustomError(STATUS_CODES.NOT_FOUND,'Plan not found'); 
    }
    return updatedPlan;
  }


  async getAllPlan( userType?: string ,page?: number,limit?: number,searchTerm?: string ): Promise<{ plans: Plans[]; total?: number }> {
    const filter: { 
      isDeleted: boolean; 
      userType?: string; 
      planType?: { $regex: string; $options: string }; 
    } = { isDeleted: false };
  

    if (userType) {
      filter.userType = userType;
    }
  
   
    if (searchTerm) {
      filter.planType = { $regex: searchTerm, $options: "i" }; 
    }
  
    if (page && limit) {

      const skip = (page - 1) * limit;
      const plans = await this.planRepository.getAllPlans(filter, skip, limit);
      const total = await this.planRepository.countPlans(filter);

  
      return {
        plans, total
      };
    } else {
      const plans = await this.planRepository.getAllPlans(filter);
      return { plans };
    }
  }


  async deletePlan(planId: string): Promise<Plans | null> {
    const deletedPlan = await this.planRepository.deletePlan(planId);
    return deletedPlan;
  }
  
}




