


import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { ITempCompanyRepository } from '../../../Domain2/respositories/ITempCompanyRepo';
import { TempCompanyModel } from '../models/TempCompanyModel';
import { ITempCompany } from '../../../Domain2/entities/TempCompany';
import { MESSAGES } from '../../../shared/constants/messages';

export class TempCompanyRepository implements ITempCompanyRepository {
  async create(tempCompany: ITempCompany): Promise<ITempCompany> {
    const newTempCompany = new TempCompanyModel(tempCompany);
    await newTempCompany.save();
    return newTempCompany;
  }

  async findByEmail(email: string): Promise<ITempCompany | null> {
    const company = await TempCompanyModel.findOne({ email }).exec();
    return company ? company : null;
  }

  async deleteByEmail(email: string): Promise<void> {
    await TempCompanyModel.deleteMany({ email }).exec();
  }

  async updateOne(company: ITempCompany): Promise<ITempCompany> {
    const updatedCompany = await TempCompanyModel.findOneAndUpdate(
      { email: company.email },
      company,
      { new: true }
    )
      .lean()
      .exec();
    if (!updatedCompany) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.COMPANY_NOT_FOUND
      );
    }
    return updatedCompany;
  }
}
