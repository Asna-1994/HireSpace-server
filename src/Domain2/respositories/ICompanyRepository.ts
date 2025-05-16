import { ICompanyDTO } from "../../Application2/dto/Company/companyDTO";
import { ICompany } from "../entities/Company";


export interface ICompanyRepository {
  findByEmail(email: string): Promise<ICompanyDTO | null>;
  findById(companyId: string): Promise<ICompanyDTO | null>;
  update(company: ICompany): Promise<ICompanyDTO>;
  delete(email: string): Promise<void>;
  findCompanies(
    offset: number,
    limit: number,
    filter: object
  ): Promise<{ companies: ICompanyDTO[]; total: number }>;
  create(company: Partial<ICompany>): Promise<ICompanyDTO>;
  findCompaniesWithPagination(
    offset: number,
    limit: number,
    filter: object
  ): Promise<ICompanyDTO[]>;
  blockOrUnblock(companyId: string, action: string): Promise<ICompanyDTO>;
  countTotal(dateQuery: any): Promise<number>;
  saveRefreshToken(companyId: string, token: string): Promise<void>;
  verifyRefreshToken(companyId: string, token: string): Promise<boolean>;
  removeRefreshToken(companyId: string, token: string): Promise<void>;
  removeAllRefreshTokens(companyId: string): Promise<void>; 
}
