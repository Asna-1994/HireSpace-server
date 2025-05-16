import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';

import { CustomError } from '../../../shared/error/customError';
import { BlockOrUnblockUserUseCase } from '../../../Application2/usecases/admin/BlockOrUnblockUser';


export class BlockOrUnblockUserController {
  constructor(private blockOrUnblockUseCase: BlockOrUnblockUserUseCase) {}

 blockOrUnblock = async (req: Request, res: Response, next: NextFunction) =>  {
    try {
      const { userId, action } = req.params;

      if (!userId || !action) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Missing required query parameters:userId, or action'
        );
      }

      const updatedUSer = await this.blockOrUnblockUseCase.execute(
        userId as string,
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
}
