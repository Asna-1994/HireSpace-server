import { IPlansDTO } from "../../../Application2/dto/Plans/PlansDTO";
import { IPlans } from "../../../Domain2/entities/AppPlans";
import { IPlanRepository } from "../../../Domain2/respositories/IPlanRepository";
import { normalizePlans } from "../../../shared/utils/Normalisation/normalisePlan";
import { PlanModel } from "../models/PlanModel";



export class PlanRepository implements IPlanRepository {
  async createPlan(planData: Partial<IPlans>): Promise<IPlansDTO> {
    const plan = new PlanModel(planData);
    await plan.save();
    return normalizePlans(plan)
  }

  async getPlanById(planId: string): Promise<IPlansDTO | null> {
    const plan = await PlanModel.findById(planId).lean().exec();
    return plan ? normalizePlans(plan) : null;
  }

  async updatePlan(
    id: string,
    planData: Partial<IPlans>
  ): Promise<IPlansDTO | null> {
    const plan = await PlanModel.findByIdAndUpdate(id, planData, { new: true })
      .lean()
      .exec();
    return plan ? normalizePlans(plan) : null;
  }

  async deletePlan(planId: string): Promise<IPlansDTO | null> {
    const plan = await PlanModel.findByIdAndUpdate(planId, { isDeleted: true })
      .lean()
      .exec();
    return plan ? normalizePlans(plan) : null;
  }

  async getAllPlans(
    filter: object,
    skip?: number,
    limit?: number
  ): Promise<IPlansDTO[]> {
    let plans;
    if (skip !== undefined && limit !== undefined) {
      plans = await PlanModel.find(filter).sort({createdAt : -1}).skip(skip).limit(limit).lean();
    } else {
      plans = await PlanModel.find(filter).sort({createdAt : -1}).lean();
    }
    return plans.map(normalizePlans);
  }

  async countPlans(filter: object): Promise<number> {
    return PlanModel.countDocuments(filter);
  }
}
