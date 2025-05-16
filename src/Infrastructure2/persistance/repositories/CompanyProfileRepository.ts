import { ICompanyProfileDTO } from '../../../Application2/dto/Company/CompanyProfileDTO';
import { ICompanyProfile } from '../../../Domain2/entities/CompanyProfile';
import { ICompanyProfileRepository } from '../../../Domain2/respositories/ICompanyProfileRepo';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { CustomError } from '../../../shared/error/customError';
import { normalizeCompanyProfile } from '../../../shared/utils/Normalisation/normaliseCompany';
import { CompanyProfileModel } from '../models/CompanyProfileModel';


export class CompanyProfileRepository implements ICompanyProfileRepository {

  async findOne(companyId: string): Promise<ICompanyProfileDTO| null> {
    const companyProfile = await CompanyProfileModel.findOne({
      companyId: companyId,
    }).lean();

    return companyProfile ? normalizeCompanyProfile(companyProfile) : null;
  }

//update profile
  async update(companyProfile: ICompanyProfile): Promise<ICompanyProfileDTO> {
    const updatedProfile = await CompanyProfileModel.findByIdAndUpdate(
      companyProfile._id,
      companyProfile,
      { new: true }
    )
      .lean()
      .exec();

    if (!updatedProfile) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, 'Profile not found');
    }
    return normalizeCompanyProfile(updatedProfile);
  }

  async findOneAndUpdate(
    filter: object,
    update: object,
    options: object
  ): Promise<ICompanyProfileDTO | null> {
    const companyProfile = await CompanyProfileModel.findOneAndUpdate(
      filter,
      update,
      options
    ).lean();
    return companyProfile ? normalizeCompanyProfile(companyProfile) : null;
  }

  
  async create(
    companyProfile: Partial<ICompanyProfile>
  ): Promise<ICompanyProfileDTO> {
    const newCompanyProfile = new CompanyProfileModel(companyProfile);
    const savedProfile = await newCompanyProfile.save();
    return normalizeCompanyProfile(savedProfile);
  }
}
