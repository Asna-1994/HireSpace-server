import { STATUS_CODES } from './../../../shared/constants/statusCodes';
import { Request, Response, NextFunction } from 'express';
import { MESSAGES } from '../../../shared/constants/messages';
import { ManageProfileUseCase } from '../../../Application/usecases/company/manageProfileUsecase';
import { CustomError } from '../../../shared/error/customError';

export class ManageProfileController {
  constructor(private manageProfileUseCase: ManageProfileUseCase) {}

  async updatedCompanyDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyName, establishedDate, phone, address, industry } =
        req.body;
      const { companyId } = req.params;
      const companyData = {
        companyName,
        establishedDate,
        phone,
        address,
        industry,
        companyId,
      };
      const updatedCompany =
        await this.manageProfileUseCase.editBasicDetails(companyData);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.SUCCESSFULLY_UPDATED,
        data: {
          company: updatedCompany,
        },
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }

  //get profile
  async getCompanyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId } = req.params;
      if (!companyId) {
        throw new CustomError(
          STATUS_CODES.BAD_REQUEST,
          'Please provide company Id'
        );
      }
      const companyProfile =
        await this.manageProfileUseCase.getCompanyProfile(companyId);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.DATA_FETCHED,
        data: {
          profile: companyProfile,
        },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //update profile
  async updatedCompanyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        founder,
        ceo,
        mission,
        vision,
        description,
        website,
        aboutUs,
        socialLinks,
      } = req.body;
      const { companyId } = req.params;
      const companyData = {
        founder,
        ceo,
        mission,
        vision,
        description,
        aboutUs,
        website,
        socialLinks,
        companyId,
      };
      const updatedCompanyProfile =
        await this.manageProfileUseCase.editCompanyProfile(companyData);

      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: MESSAGES.SUCCESSFULLY_UPDATED,
        data: {
          profile: updatedCompanyProfile,
        },
      });
    } catch (error) {
      next(error);
      console.log(error);
    }
  }
}
