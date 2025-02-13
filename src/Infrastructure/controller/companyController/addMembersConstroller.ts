import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { AddMembersUseCase } from '../../../Application/usecases/company/addMembersUseCase';

export class AddMembersController {
  constructor(private addMembersUseCase: AddMembersUseCase) {}

  async addMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { userEmail, userRole } = req.body;
      const { companyId } = req.params;

      const { updatedUser, updatedCompany } =
        await this.addMembersUseCase.execute(userEmail, companyId, userRole);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.SUCCESSFULLY_ADDED,
        data: {
          company: updatedCompany,
          newMember: updatedUser,
        },
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }

  async getAllMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = req.params;
      const members = await this.addMembersUseCase.getMemberDetails(companyId);
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        data: {
          members,
        },
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }
  //remove member
  async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, userId } = req.params;

      const { updatedUser, updatedCompany } =
        await this.addMembersUseCase.removeMember(companyId, userId);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.SUCCESSFULLY_ADDED,
        data: {
          company: updatedCompany,
          newMember: updatedUser,
        },
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }
}
