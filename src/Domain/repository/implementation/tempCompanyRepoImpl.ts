import { TempCompanyRepository } from '../repo/tempCompanyRepository';
import { TempCompanyModel } from '../../../Infrastructure/models/tempCompanyModel';
import { TempCompany } from '../../entities/tempCompany';
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';

export class TempCompanyRepositoryImpl implements TempCompanyRepository {
  async create(tempCompany: TempCompany): Promise<TempCompany> {
    const newTempCompany = new TempCompanyModel(tempCompany);
    await newTempCompany.save();
    return newTempCompany;
  }

  async findByEmail(email: string): Promise<TempCompany | null> {
    const company = await TempCompanyModel.findOne({ email }).exec();
    return company ? company : null;
  }

  async deleteByEmail(email: string): Promise<void> {
    await TempCompanyModel.deleteMany({ email }).exec();
  }

  async updateOne(company: TempCompany): Promise<TempCompany> {
    const updatedCompany = await TempCompanyModel.findOneAndUpdate(
      { email: company.email },
      company,
      { new: true }
    )
      .lean()
      .exec();
    if (!updatedCompany) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, 'company not found');
    }
    return updatedCompany;
  }
}
