import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { ManageMembersUseCase } from '../../../Application2/usecases/company/ManageMembersUseCase';


export class ManageMembersController
 {
  constructor(private manageMembersUseCase: ManageMembersUseCase) {}

addMember = async (req: Request, res: Response, next: NextFunction) =>  {
    try {
      const { userEmail, userRole } = req.body;
      const { companyId } = req.params;

      const { updatedUser, updatedCompany } =
        await this.manageMembersUseCase.execute(userEmail, companyId, userRole);

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

 getAllMembers = async (req: Request, res: Response, next: NextFunction)  => {
    try {
      const { companyId } = req.params;
      const members = await this.manageMembersUseCase.getMemberDetails(companyId);
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
 removeMember = async (req: Request, res: Response, next: NextFunction)  => {
    try {
      const { companyId, userId } = req.params;

      const { updatedUser, updatedCompany } =
        await this.manageMembersUseCase.removeMember(companyId, userId);

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
