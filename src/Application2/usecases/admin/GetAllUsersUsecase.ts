import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { ISpamRepository } from '../../../Domain2/respositories/ISpamRepo';
import { parse, isValid, startOfDay, endOfDay } from 'date-fns';

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

  // async getPremiumUsers({
  //   page,
  //   limit,
  //   searchTerm,
  //   userRole,
  //   startDate,
  //   endDate,
  // }: {
  //   page: number;
  //   limit: number;
  //   searchTerm: string;
  //   userRole: string;
  //   startDate?:string;
  //   endDate?: string;
  // }) {
  //   const offset = (page - 1) * limit;

  //   const filter: any = {
  //     isPremium: true,
  //     'appPlan.planType': { $ne: 'basic' },
  //     'appPlan.startDate': { $ne: null },
  //     'appPlan.endDate': { $ne: null },
  //     ...(searchTerm && {
  //       $or: [
  //         { userName: { $regex: searchTerm, $options: 'i' } },
  //         { email: { $regex: searchTerm, $options: 'i' } },
  //         { phone: { $regex: searchTerm, $options: 'i' } },
  //            { 'appPlan.planType': { $regex: searchTerm, $options: 'i' } }, 
  //       ],
  //     }),
  //     ...(userRole && { userRole }),
  //   };
  //   const { users, total } = await this.userRepository.findPremiumUsers(
  //     offset,
  //     limit,
  //     filter
  //   );

  //   return { users, total };
  // }


  async getPremiumUsers({
  page,
  limit,
  searchTerm,
  userRole,
  startDate,
  endDate,
}: {
  page: number;
  limit: number;
  searchTerm: string;
  userRole: string;
  startDate?: string;
  endDate?: string;
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

  
  if (startDate || endDate) {
    filter['appPlan.startDate'] = {};
    if (startDate) {
      filter['appPlan.startDate'].$gte = new Date(startDate);
    }
    if (endDate) {
      filter['appPlan.startDate'].$lte = new Date(endDate);
    }
  }




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
    date
  }: {
    page: number;
    limit: number;
    searchTerm?: string;
    date? : string;
  }) {
    const offset = (page - 1) * limit;

    const filter ={searchTerm, date}

    const  {total, spamReports} = await this.spamRepository.getAllSpamReport(filter,offset,limit)

    const totalPages = Math.ceil(total / limit);
    const currentPage = page;
    return {
      spams : spamReports,
      total,
      totalPages,
      currentPage,
    };
  }
}
