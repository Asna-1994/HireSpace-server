import { Request, Response, NextFunction } from "express";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";
import { MESSAGES } from "../../../shared/constants/messages";

import { CustomError } from "../../../shared/error/customError";
import { BlockOrUnblockUserUseCase } from "../../../Application/usecases/admin/blockOrUnblockUser";

export class BlockOrUnblockUserController {
  constructor(private blockOrUnblockUseCase: BlockOrUnblockUserUseCase) {}

  async blockOrUnblock(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, action } = req.params;

      if (!userId || !action) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          "Missing required query parameters:userId, or action",
        );
      }

      const updatedUSer = await this.blockOrUnblockUseCase.execute(
        userId as string,
        action as string,
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
}
