import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import mongoose from 'mongoose';
import { ICompanyRepository } from '../../../Domain2/respositories/ICompanyRepository';
import { ICompanyProfileRepository } from '../../../Domain2/respositories/ICompanyProfileRepo';
import { denormalizeCompany, denormalizeCompanyProfile } from '../../../shared/utils/Normalisation/normaliseCompany';

export class ManageProfileUseCase {
  constructor(
    private CompanyRepository:ICompanyRepository,
    private companyProfileRepository: ICompanyProfileRepository
  ) {}

  async editBasicDetails(companyData: {
    companyName?: string;
    establishedDate?: Date;
    phone?: string;
    address?: string;
    industry?: string;
    companyId: string;
  }) {
    console.log(companyData);
    const {
      companyName,
      establishedDate,
      phone,
      address,
      industry,
      companyId,
    } = companyData;

    const existingCompany = await this.CompanyRepository.findById(companyId);
    if (!existingCompany) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.COMPANY_NOT_FOUND);
    }
    if (companyName) {
      existingCompany.companyName = companyName;
    }
    if (phone) {
      existingCompany.phone = phone;
    }
    if (industry) {
      existingCompany.industry = industry;
    }
    if (establishedDate) {
      existingCompany.establishedDate = establishedDate;
    }
    if (address) {
      existingCompany.address = address;
    }
        const normalizedData = denormalizeCompany(existingCompany)
    const updatedCompany = await this.CompanyRepository.update(normalizedData);
    // console.log('updated company',updatedCompany)
    return updatedCompany;
  }

  //get company profile
  async getCompanyProfile(companyId: string) {
    const companyProfile =
      await this.companyProfileRepository.findOne(companyId);
    return companyProfile;
  }

  // edit company Profile
  async editCompanyProfile(companyData: {
    founder?: string;
    ceo?: string;
    description?: string;
    aboutUs?: string;
    socialLinks: Record<string, string>; // Social links are now an object.
    mission?: string;
    vision?: string;
    companyId: string;
    website: string;
  }) {
    console.log(companyData);
    const {
      founder,
      ceo,
      description,
      aboutUs,
      socialLinks,
      mission,
      vision,
      companyId,
      website,
    } = companyData;

    let companyProfile = await this.companyProfileRepository.findOne(companyId);

    const companyIdObject = new mongoose.Types.ObjectId(companyId);

    if (!companyProfile) {
      companyProfile = await this.companyProfileRepository.create({
        ...companyData,
        companyId: companyIdObject,
      });
    } else {
      companyProfile.founder = founder;
      companyProfile.ceo = ceo;
      companyProfile.description = description;
      companyProfile.socialLinks = socialLinks;
      companyProfile.mission = mission;
      companyProfile.vision = vision;
      companyProfile.website = website;
    }

    const normalizedData = denormalizeCompanyProfile(companyProfile)
    const savedCompanyProfile =
      await this.companyProfileRepository.update(normalizedData);

    return savedCompanyProfile;
  }
}
