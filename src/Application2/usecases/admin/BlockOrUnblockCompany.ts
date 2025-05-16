import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import { ICompanyRepository } from '../../../Domain2/respositories/ICompanyRepository';
import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { IJobPostRepository } from '../../../Domain2/respositories/IJobPostRepository';
import { IEmailService } from '../../../Domain2/services/IEmailService';
import { SendVerificationStatusDTO } from '../../dto/mail/MailDTO';
import { denormalizeCompany } from '../../../shared/utils/Normalisation/normaliseCompany';

export class BlockOrUnblockCompanyUseCase {
  
  constructor(private CompanyRepository: ICompanyRepository,
     private userRepository  : IUserRepository, 
    private jobPostRepository :IJobPostRepository,
    private emailService : IEmailService
  ) {}

  async execute(companyId: string, action: string) {
    const updatedCompany = await this.CompanyRepository.blockOrUnblock(
      companyId,
      action
    );



    if (!updatedCompany) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.COMPANY_NOT_FOUND);
    }

    const isBlocked = action === 'block';

  
    await this.userRepository.updateMany(
      { companyId }, 
      { $set: { isBlocked } } 
    );


    await this.jobPostRepository.updateMany( { companyId }, 
      { $set: { isBlocked } } );

      if (isBlocked) {
        const users = await this.userRepository.find({ companyId });
    
        for (const user of users) {
          await this.userRepository.removeAllRefreshTokens(user._id.toString());
        }
      }


      
    return updatedCompany;
  }

  


  async verifyCompany(companyId: string) {
    try {
      const company = await this.CompanyRepository.findById(companyId);
      if (!company) {
        throw new CustomError(
          STATUS_CODES.NOT_FOUND,
          MESSAGES.COMPANY_NOT_FOUND
        );
      }
      company.isVerified = true;
          const denormalized = denormalizeCompany(company)
      const updatedCompany = await this.CompanyRepository.update(denormalized);
const data : SendVerificationStatusDTO ={
  email: company.email,
 companyName:   company.companyName,
  status: 'approved' 
}
      this.emailService.sendVerificationStatusMail(data);
      return updatedCompany;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
      MESSAGES.VERIFICATION_FAILED
      );
    }
  }
}
