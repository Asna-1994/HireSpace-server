import { ICompanyProfileDTO } from "../../Application2/dto/Company/CompanyProfileDTO";
import { ICompanyProfile } from "../entities/CompanyProfile";


export interface ICompanyProfileRepository {
  findOne(companyId: string): Promise<ICompanyProfileDTO | null>;
  update(companyProfile: ICompanyProfile): Promise<ICompanyProfileDTO>;
  create(companyProfile: Partial<ICompanyProfile>): Promise<ICompanyProfileDTO>;
  findOneAndUpdate(
    filter: object,
    update: object,
    options: object
  ): Promise<ICompanyProfileDTO | null>;
}
