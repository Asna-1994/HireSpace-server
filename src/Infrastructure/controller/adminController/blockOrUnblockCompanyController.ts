import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";
import { MESSAGES } from "../../../shared/constants/messages";

import { CustomError } from "../../../shared/error/customError";
import { BlockOrUnblockCompanyUseCase } from "../../../Application/usecases/admin/blockOrUnblockCompany";

export class BlockOrUnblockCompanyController {
  constructor(private blockOrUnblockUseCase: BlockOrUnblockCompanyUseCase) {}

  async blockOrUnblock(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, action } = req.params;

      if (!companyId || !action) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          "Missing required query parameters:companyId, or action"
        );
      }

      const updatedUSer = await this.blockOrUnblockUseCase.execute(
        companyId as string,
        action as string
      );

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.UPDATED,
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }

  async verifyCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = req.params;

      if (!companyId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          "Missing required query parameters:companyId"
        );
      }

      const updatedCompany = await this.blockOrUnblockUseCase.verifyCompany(
        companyId
      );
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "Company verified",
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }
}
