import { CompanyRepository } from '../../../Domain/repository/repo/companyRepository';

export class GetAllCompaniesUseCase {
  constructor(private companyRepository: CompanyRepository) {}

  async execute({
    page = 1,
    limit = 10,
    searchTerm = '',
  }: {
    page?: number;
    limit?: number;
    searchTerm?: string;
  }) {
    const offset = (page - 1) * limit;
    const filter = searchTerm
      ? {
          $or: [
            { companyName: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } },
            { phone: { $regex: searchTerm, $options: 'i' } },
          ],
        }
      : {};

    const { companies, total } = await this.companyRepository.findCompanies(
      offset,
      limit,
      filter
    );
    return { companies, total };
  }
}
