import { ManagePlanUseCase } from "./../../../Application/usecases/plans/plansUseCase";
import { NextFunction, Request, Response } from "express";
import { PlanRepositoryImpl } from "../../../Domain/repository/implementation/planRepoImpl";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";
import { MESSAGES } from "../../../shared/constants/messages";

const planRepository = new PlanRepositoryImpl();
const managePlanUseCase = new ManagePlanUseCase(planRepository);

export class PlanController {
  static async createPlan(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const planData = req.body;
      const { planId } = req.query;
      let result;
      let message;
      if (planId) {
        result = await managePlanUseCase.updatePlan(planId as string, planData);
        message = "Plan updated successfully";
      } else {
        result = await managePlanUseCase.createPlan(planData);
        message = "Plan created successfully";
      }

      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: "Plan created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllPlans(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userType = (req.query.userType as string) || "";
      const page = req.query.page
        ? parseInt(req.query.page as string, 10)
        : undefined;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : undefined;
      const searchTerm = (req.query.search as string) || "";

      const { plans, total } = await managePlanUseCase.getAllPlan(
        userType,
        page,
        limit,
        searchTerm,
      );

      const responseData: {
        plans: typeof plans;
        total?: number;
        currentPage?: number;
        limit?: number;
        totalPages?: number;
      } = { plans };

      if (page && limit) {
        responseData.total = total || plans.length;
        responseData.currentPage = page;
        responseData.totalPages = Math.ceil(responseData.total / limit) || 1;
      }

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        data: responseData,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deletePlan(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const planId = req.params.planId;
      const deletedPlan = await managePlanUseCase.deletePlan(planId);

      res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: "Plan created successfully",
        data: deletedPlan,
      });
    } catch (error) {
      next(error);
    }
  }
}
