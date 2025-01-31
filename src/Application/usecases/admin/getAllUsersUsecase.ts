import { SpamRepository } from './../../../Domain/repository/repo/spamRepository';
import { UserRepository } from '../../../Domain/repository/repo/userRepository';
import { CustomError } from "../../../shared/error/customError";
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { SpamModel } from '../../../Infrastructure/models/SpamModel';


export class GetAllUsersUseCase {
  constructor(
    private userRepository : UserRepository,
    private spamRepository : SpamRepository
  ) {}

  async execute({
    page = 1,
    limit = 10,
    searchTerm = '',
    userRole = ''
  }: {
    page?: number;
    limit?: number;
    searchTerm? : string;
    userRole?:string;
  }) {
   
    const offset = (page - 1) * limit;
    const filter: any = {
      ...(searchTerm && {
        $or: [
          { userName: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
          { phone: { $regex: searchTerm, $options: "i" } },
        ],
      }),
      ...(userRole && { userRole }), 
    };

    const{ users, total} = await  this.userRepository.findUsers(offset, limit, filter)
    return { users, total}
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
        isPremium : true,
        'appPlan.planType': { $ne: 'basic' }, 
        'appPlan.startDate': { $ne: null },  
        'appPlan.endDate': { $ne: null },     
        ...(searchTerm && {
          $or: [
            { userName: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } },
            { phone: { $regex: searchTerm, $options: 'i' } },
          ],
        }),
        ...(userRole && { userRole }),
      };
      const { users, total } = await this.userRepository.findPremiumUsers(offset, limit, filter);
  
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
      const offset = (page - 1) * limit; // Calculate the offset based on page and limit
    
      // Build the filter for querying spam reports
      const filter: any = {
        ...(searchTerm && {
          $or: [
            { "reportedByUser.userName": { $regex: searchTerm, $options: 'i' } },
            { "reportedByUser.email": { $regex: searchTerm, $options: 'i' } },
            { "companyId.companyName": { $regex: searchTerm, $options: 'i' } },
            { "companyId.email": { $regex: searchTerm, $options: 'i' } },
            { "companyId.phone": { $regex: searchTerm, $options: 'i' } },
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
