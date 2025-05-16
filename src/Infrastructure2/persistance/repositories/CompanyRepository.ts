import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { ICompanyRepository } from '../../../Domain2/respositories/ICompanyRepository';
import { ICompanyDTO } from '../../../Application2/dto/Company/companyDTO';
import { ICompany } from '../../../Domain2/entities/Company';
import { CompanyModel } from '../models/CompanyModel';
import { normalizeCompany } from '../../../shared/utils/Normalisation/normaliseCompany';
import { MESSAGES } from '../../../shared/constants/messages';


export class CompanyRepository implements ICompanyRepository {
  async create(companyData: Partial<ICompany>): Promise<ICompanyDTO> {
    const newCompany = new CompanyModel(companyData);
    const savedCompany = await newCompany.save();
    return normalizeCompany(savedCompany.toObject());
  }

  async countTotal(dateQuery: any = {}): Promise<number> {
    return await CompanyModel.countDocuments(dateQuery);
  }

  async findByEmail(email: string): Promise<ICompanyDTO | null> {
    const company = await CompanyModel.findOne({ email }).lean().exec();
    return company ? normalizeCompany(company) : null;
  }

  async findByGoogleId(googleId: string): Promise<ICompanyDTO | null> {
    const company = await CompanyModel.findOne({ googleId }).lean().exec();
    return company ? normalizeCompany(company) : null;
  }

  async update(company: ICompany): Promise<ICompanyDTO> {
    const updatedCompany = await CompanyModel.findByIdAndUpdate(
      company._id,
      company,
      { new: true }
    )
      .lean()
      .exec();
    if (!updatedCompany) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, 'Company not found');
    }
    return normalizeCompany(updatedCompany);
  }

  async delete(companyId: string): Promise<void> {
    await CompanyModel.findByIdAndDelete(companyId).exec();
  }
  async findCompaniesWithPagination(
    offset: number,
    limit: number,
    filter: object
  ): Promise<ICompanyDTO[]> {
    const companies = await CompanyModel.find(filter)
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();
    return companies.map(normalizeCompany);
  }

  async findCompanies(
    offset: number,
    limit: number,
    filter: object
  ): Promise<{ companies: ICompanyDTO[]; total: number }> {
    const [companies, total] = await Promise.all([
      CompanyModel.find(filter).skip(offset).limit(limit).lean().exec(),
      CompanyModel.countDocuments(filter),
    ]);

    return { companies: companies.map(normalizeCompany), total };
  }

  async findById(companyId: string): Promise<ICompanyDTO | null> {
    const company = await CompanyModel.findById(companyId).lean().exec();
    return company ?  normalizeCompany(company) : null
  }

  async blockOrUnblock(companyId: string, action: string): Promise<ICompanyDTO> {
   const isBlocked = action === 'block';

  const updatedCompany = await CompanyModel.findByIdAndUpdate(
    companyId,
    { isBlocked },
    { new: true }
  );

  if (!updatedCompany) {
    throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.COMPANY_NOT_FOUND);
  }

  if (isBlocked) {
    await this.removeAllRefreshTokens(companyId);
  }

  return normalizeCompany(updatedCompany);
  }


      async saveRefreshToken(companyId: string, token: string): Promise<void> {
      await CompanyModel.findByIdAndUpdate(
        companyId,
        { $addToSet: { refreshTokens: token } }, 
        { new: true }
      );
    }
  
    async verifyRefreshToken(companyId: string, token: string): Promise<boolean> {
      const company = await CompanyModel.findById(companyId);
      if (!company) return false;
      return company.refreshTokens.includes(token);
    }
  
    async removeRefreshToken(companyId: string, token: string): Promise<void> {
      await CompanyModel.findByIdAndUpdate(
        companyId,
        { $pull: { refreshTokens: token } }
      );
    }
  
    async removeAllRefreshTokens(companyId: string): Promise<void> {
      await CompanyModel.findByIdAndUpdate(
        companyId,
        { $set: { refreshTokens: [] } }
      );
    }
}
