import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { MESSAGES } from '../../../shared/constants/messages';
import mongoose from 'mongoose';
import { ITempCompanyRepository } from '../../../Domain2/respositories/ITempCompanyRepo';
import { ICompanyRepository } from '../../../Domain2/respositories/ICompanyRepository';
import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { ICompanyProfileRepository } from '../../../Domain2/respositories/ICompanyProfileRepo';
import { ICompany } from '../../../Domain2/entities/Company';
import { denormalizeCompany } from '../../../shared/utils/Normalisation/normaliseCompany';

export class VerifyOtpUseCase {
  constructor(
    private tempCompanyRepository: ITempCompanyRepository,
    private companyRepository: ICompanyRepository,
    private userRepository: IUserRepository,
    private companyProfileRepo: ICompanyProfileRepository
  ) {}

  async execute(email: string, otp: string): Promise<Partial<ICompany>> {
    const tempCompany = await this.tempCompanyRepository.findByEmail(email);
    console.log(tempCompany);

    if (!tempCompany) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.NOT_FOUND);
    }

    if (tempCompany.otp !== otp) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.INVALID);
    }

    console.log(
      'OTP Expiry:',
      tempCompany.otpExpiry,
      'Current Time:',
      Date.now()
    );

    if (tempCompany.otpExpiry < new Date()) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.EXPIRED);
    }

    const newCompany = {
      companyName: tempCompany.companyName,
      email: tempCompany.email,
      phone: tempCompany.phone,
      address: tempCompany.address,
      establishedDate: tempCompany.establishedDate,
      industry: tempCompany.industry,
      password: tempCompany.password,
      entity: 'company' as 'company' | 'user',
      //   admin : new mongoose.Types.ObjectId(tempCompany.companyAdminEmail)
    }

    const createdCompany = await this.companyRepository.create(newCompany);

    const adminUser = await this.userRepository.findByEmail(
      tempCompany.companyAdminEmail
    );

    if (adminUser) {
      adminUser.companyId = new mongoose.Types.ObjectId(createdCompany._id);
      createdCompany.members.push({
        role: 'companyAdmin',
        userId: adminUser._id.toString(),
      });
      await this.userRepository.update(adminUser);
      const denormalized = denormalizeCompany(createdCompany)
      await this.companyRepository.update(denormalized);
    }

    const companyProfile = await this.companyProfileRepo.create({
      companyId: new mongoose.Types.ObjectId(createdCompany._id),
    });
    await this.tempCompanyRepository.deleteByEmail(email);

    return newCompany;
  }
}
