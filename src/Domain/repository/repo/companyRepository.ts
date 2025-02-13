import { Company } from '../../entities/Company';

export interface CompanyRepository {
  findByEmail(email: string): Promise<Company | null>;
  findById(companyId: string): Promise<Company | null>;
  update(company: Company): Promise<Company>;
  delete(email: string): Promise<void>;
  findCompanies(
    offset: number,
    limit: number,
    filter: object
  ): Promise<{ companies: Company[]; total: number }>;
  create(company: Partial<Company>): Promise<Company>;
  findCompaniesWithPagination(
    offset: number,
    limit: number,
    filter: object
  ): Promise<Company[]>;
  blockOrUnblock(companyId: string, action: string): Promise<Company>;
  countTotal(dateQuery: any): Promise<number>;
}
