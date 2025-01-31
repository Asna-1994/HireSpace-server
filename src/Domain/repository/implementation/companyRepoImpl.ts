import { CustomError } from "../../../shared/error/customError";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";
import { CompanyRepository } from "../repo/companyRepository";
import { CompanyModel } from "../../../Infrastructure/models/CompanyModel";
import { Company, normalizeCompany } from "../../entities/Company";

export class CompanyRepositoryImpl implements CompanyRepository {
  async create(companyData: Partial<Company>): Promise<Company> {
    const newCompany = new CompanyModel(companyData);
    const savedCompany = await newCompany.save();
    return normalizeCompany(savedCompany.toObject());
  }

  async countTotal(dateQuery: any = {}): Promise<number> {
    return await CompanyModel.countDocuments(dateQuery);
}

  async findByEmail(email: string): Promise<Company | null> {
    const company = await CompanyModel.findOne({ email }).lean().exec();
    return company ? normalizeCompany(company) : null;
  }

  async findByGoogleId(googleId: string): Promise<Company | null> {
    const company = await CompanyModel.findOne({ googleId }).lean().exec();
    return company ? normalizeCompany(company) : null;
  }

  async update(company: Company): Promise<Company> {
    const updatedCompany = await CompanyModel.findByIdAndUpdate(
      company._id,
      company,
      { new: true }
    )
      .lean()
      .exec();
    if (!updatedCompany) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, "Company not found");
    }
    return normalizeCompany(updatedCompany);
  }

  async delete(companyId: string): Promise<void> {
    await CompanyModel.findByIdAndDelete(companyId).exec();
  }
  async findCompaniesWithPagination(
    offset: number,
    limit: number,filter : object
  ): Promise<Company[]> {
    const companies = await CompanyModel.find(filter)
      .skip(offset)
      .limit(limit)
      .lean()
      .exec();
    return companies.map(normalizeCompany);
  }

  async findCompanies(offset: number, limit: number, filter: object): Promise<{ companies: Company[], total: number }> {
    const [companies, total] = await Promise.all([
      CompanyModel.find(filter).skip(offset).limit(limit).lean().exec(),
      CompanyModel.countDocuments(filter),
    ]);
  
    return { companies: companies.map(normalizeCompany), total };

  }


  async findById(companyId: string): Promise<Company | null> {
    const company = await CompanyModel.findById(companyId).lean().exec();
    return normalizeCompany(company )
  }

    async blockOrUnblock(companyId : string, action : string) : Promise<Company>{
        let blockedCompany
        if(action==='block'){
            blockedCompany = await CompanyModel.findByIdAndUpdate(companyId , {isBlocked : true}, {new : true})
        }else{
             blockedCompany = await CompanyModel.findByIdAndUpdate(companyId , {isBlocked : false}, {new : true})
        }
     
      return normalizeCompany(blockedCompany);
    }
}
