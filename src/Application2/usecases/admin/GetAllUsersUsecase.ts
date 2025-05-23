


import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { ISpamRepository } from '../../../Domain2/respositories/ISpamRepo';
import { SpamModel } from '../../../Infrastructure2/persistance/models/SpamModel';

export class GetAllUsersUseCase {
  constructor(
    private userRepository: IUserRepository,
    private spamRepository: ISpamRepository
  ) {}

  async execute({
    page = 1,
    limit = 10,
    searchTerm = '',
    userRole = '',
  }: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    userRole?: string;
  }) {
    const offset = (page - 1) * limit;
    const filter: any = {
      ...(searchTerm && {
        $or: [
          { userName: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
          { phone: { $regex: searchTerm, $options: 'i' } },
               { userRole: { $regex: searchTerm, $options: 'i' } },
        ],
      }),
  
    };

    const { users, total } = await this.userRepository.findUsers(
      offset,
      limit,
      filter
    );
    return { users, total };
  }

  async getPremiumUsers({
    page,
    limit,
    searchTerm,
    userRole,
  }: {
    page: number;
    limit: number;
    searchTerm: string;
    userRole: string;
  }) {
    const offset = (page - 1) * limit;

    const filter: any = {
      isPremium: true,
      'appPlan.planType': { $ne: 'basic' },
      'appPlan.startDate': { $ne: null },
      'appPlan.endDate': { $ne: null },
      ...(searchTerm && {
        $or: [
          { userName: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
          { phone: { $regex: searchTerm, $options: 'i' } },
             { 'appPlan.planType': { $regex: searchTerm, $options: 'i' } }, 
        ],
      }),
      ...(userRole && { userRole }),
    };
    const { users, total } = await this.userRepository.findPremiumUsers(
      offset,
      limit,
      filter
    );

    return { users, total };
  }

  async getAllSpamReports({
    page,
    limit,
    searchTerm,
  }: {
    page: number;
    limit: number;
    searchTerm?: string;
  }) {
    const offset = (page - 1) * limit;

    const filter: any = {
      ...(searchTerm && {
        $or: [
          { 'reportedByUser.userName': { $regex: searchTerm, $options: 'i' } },
          { 'reportedByUser.email': { $regex: searchTerm, $options: 'i' } },
          { 'companyId.companyName': { $regex: searchTerm, $options: 'i' } },
          { 'companyId.email': { $regex: searchTerm, $options: 'i' } },
          { 'companyId.phone': { $regex: searchTerm, $options: 'i' } },
            { reason: { $regex: searchTerm, $options: 'i' } },
              { description: { $regex: searchTerm, $options: 'i' } },

        ],
      }),
    };

    const [spams, total] = await Promise.all([
      this.spamRepository.getAllSpamReport(filter, offset, limit),
      SpamModel.countDocuments(filter), // Get the total matching records count
    ]);

    // Calculate pagination details
    const totalPages = Math.ceil(total / limit);
    const currentPage = page;

    return {
      spams,
      total,
      totalPages,
      currentPage,
    };
  }
}
