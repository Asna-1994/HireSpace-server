import { CompanyProfile } from '../../entities/CompanyProfile';

export interface CompanyProfileRepository {
  findOne(companyId: string): Promise<CompanyProfile | null>;
  update(companyProfile: CompanyProfile): Promise<CompanyProfile>;
  create(companyProfile: Partial<CompanyProfile>): Promise<CompanyProfile>;
  findOneAndUpdate(
    filter: object,
    update: object,
    options: object
  ): Promise<CompanyProfile | null>;
}
