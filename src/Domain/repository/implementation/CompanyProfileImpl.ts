import { CompanyProfileModel } from '../../../Infrastructure/models/companyProfileModel';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { CustomError } from '../../../shared/error/customError';
import {
  CompanyProfile,
  normalizeCompanyProfile,
} from '../../entities/CompanyProfile';
import { CompanyProfileRepository } from '../repo/companyProfileRepository';

export class CompanyProfileImpl implements CompanyProfileRepository {
  async findOne(companyId: string): Promise<CompanyProfile | null> {
    const companyProfile = await CompanyProfileModel.findOne({
      companyId: companyId,
    }).lean();

    return companyProfile ? normalizeCompanyProfile(companyProfile) : null;
  }

  async update(companyProfile: CompanyProfile): Promise<CompanyProfile> {
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
  ): Promise<CompanyProfile | null> {
    const companyProfile = await CompanyProfileModel.findOneAndUpdate(
      filter,
      update,
      options
    ).lean();
    return companyProfile ? normalizeCompanyProfile(companyProfile) : null;
  }

  async create(
    companyProfile: Partial<CompanyProfile>
  ): Promise<CompanyProfile> {
    const newCompanyProfile = new CompanyProfileModel(companyProfile);
    const savedProfile = await newCompanyProfile.save();
    return normalizeCompanyProfile(savedProfile);
  }
}
