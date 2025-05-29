
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { IPlanRepository } from '../../../Domain2/respositories/IPlanRepository';
import { IPlansDTO } from '../../dto/Plans/PlansDTO';
import { IPlans } from '../../../Domain2/entities/AppPlans';

export class ManagePlanUseCase {
  constructor(private planRepository: IPlanRepository) {}

  async createPlan(planData: Partial<IPlans>): Promise<IPlansDTO> {

    const { planType, price, userType, durationInDays, features } = planData;

    if (!planType || !price || !durationInDays || !features) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
       MESSAGES.MISSING_FIELDS
      );
    }

    return await this.planRepository.createPlan(planData);
  }

  async updatePlan(planId: string, planData: IPlans): Promise<IPlansDTO> {
    const updatedPlan = await this.planRepository.updatePlan(planId, planData);
    if (!updatedPlan) {
      throw new CustomError(STATUS_CODES.NOT_FOUND,MESSAGES.PLAN_NOT_FOUND);
    }
    return updatedPlan;
  }

  async getAllPlan(
    userType?: string,
    page?: number,
    limit?: number,
    searchTerm?: string
  ): Promise<{ plans: IPlansDTO[]; total?: number }> {
     const filter: {
    isDeleted: boolean;
    userType?: string;
    $or?: any[];
  } = { isDeleted: false };

  if (userType) {
    filter.userType = userType;
  }

  if (searchTerm) {
    const searchRegex = new RegExp(searchTerm, 'i');

    filter.$or = [
      { planType: { $regex: searchRegex } },
      { features: { $elemMatch: { $regex: searchRegex } } },
      { price: isNaN(+searchTerm) ? undefined : +searchTerm }, 
      { durationInDays: isNaN(+searchTerm) ? undefined : +searchTerm },
    ].filter(Boolean); 
  }

    if (page && limit) {
      const skip = (page - 1) * limit;
      const plans = await this.planRepository.getAllPlans(filter, skip, limit);
      const total = await this.planRepository.countPlans(filter);

      return {
        plans,
        total,
      };
    } else {
      const plans = await this.planRepository.getAllPlans(filter);
      return { plans };
    }
  }

  async deletePlan(planId: string): Promise<IPlansDTO | null> {
    const deletedPlan = await this.planRepository.deletePlan(planId);
    return deletedPlan;
  }
}
