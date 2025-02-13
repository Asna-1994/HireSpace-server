import { PlanModel } from '../../../Infrastructure/models/PlanModel';
import { PlanRepository } from '../repo/planRepo';
import { normalizePlans, Plans } from '../../entities/AppPlans';

export class PlanRepositoryImpl implements PlanRepository {
  async createPlan(planData: Partial<Plans>): Promise<Plans> {
    const plan = new PlanModel(planData);
    await plan.save();
    return normalizePlans(plan);
  }

  async getPlanById(planId: string): Promise<Plans | null> {
    const plan = await PlanModel.findById(planId).lean().exec();
    return plan ? normalizePlans(plan) : null;
  }

  async updatePlan(
    id: string,
    planData: Partial<Plans>
  ): Promise<Plans | null> {
    const plan = await PlanModel.findByIdAndUpdate(id, planData, { new: true })
      .lean()
      .exec();
    return plan ? normalizePlans(plan) : null;
  }

  async deletePlan(planId: string): Promise<Plans | null> {
    const plan = await PlanModel.findByIdAndUpdate(planId, { isDeleted: true })
      .lean()
      .exec();
    return plan ? normalizePlans(plan) : null;
  }

  async getAllPlans(
    filter: object,
    skip?: number,
    limit?: number
  ): Promise<Plans[]> {
    let plans;
    if (skip !== undefined && limit !== undefined) {
      plans = await PlanModel.find(filter).skip(skip).limit(limit).lean();
    } else {
      plans = await PlanModel.find(filter).lean();
    }
    return plans.map(normalizePlans);
  }

  async countPlans(filter: object): Promise<number> {
    return PlanModel.countDocuments(filter);
  }
}
