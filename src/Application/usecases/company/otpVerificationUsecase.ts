import { CustomError } from "../../../shared/error/customError";
import { TempCompanyRepository } from "../../../Domain/repository/repo/tempCompanyRepository";
import { Company } from "../../../Domain/entities/Company";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";
import { CompanyRepository } from "../../../Domain/repository/repo/companyRepository";
import { MESSAGES } from "../../../shared/constants/messages";
import { UserRepository } from "../../../Domain/repository/repo/userRepository";
import mongoose from "mongoose";
import { CompanyProfileRepository } from "../../../Domain/repository/repo/companyProfileRepository";

export class VerifyOtpUseCase {
  constructor(
    private tempCompanyRepository: TempCompanyRepository,
    private companyRepository: CompanyRepository,
    private userRepository: UserRepository,
    private companyProfileRepo: CompanyProfileRepository,
  ) {}

  async execute(email: string, otp: string): Promise<Company> {
    const tempCompany = await this.tempCompanyRepository.findByEmail(email);
    console.log(tempCompany);

    if (!tempCompany) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.NOT_FOUND);
    }

    if (tempCompany.otp !== otp) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.INVALID);
    }

    console.log(
      "OTP Expiry:",
      tempCompany.otpExpiry,
      "Current Time:",
      Date.now(),
    );

    if (tempCompany.otpExpiry < new Date()) {
      throw new CustomError(STATUS_CODES.BAD_REQUEST, MESSAGES.EXPIRED);
    }

    const newCompany = new Company({
      companyName: tempCompany.companyName,
      email: tempCompany.email,
      phone: tempCompany.phone,
      address: tempCompany.address,
      establishedDate: tempCompany.establishedDate,
      industry: tempCompany.industry,
      password: tempCompany.password,
      entity: "company",
      //   admin : new mongoose.Types.ObjectId(tempCompany.companyAdminEmail)
    });

    const createdCompany = await this.companyRepository.create(newCompany);

    const adminUser = await this.userRepository.findByEmail(
      tempCompany.companyAdminEmail,
    );

    if (adminUser) {
      adminUser.companyId = new mongoose.Types.ObjectId(createdCompany._id);
      createdCompany.members.push({
        role: "companyAdmin",
        userId: new mongoose.Types.ObjectId(adminUser._id),
      });
      await this.userRepository.update(adminUser);
      await this.companyRepository.update(createdCompany);
    }

    const companyProfile = await this.companyProfileRepo.create({
      companyId: new mongoose.Types.ObjectId(createdCompany._id),
    });
    await this.tempCompanyRepository.deleteByEmail(email);

    return newCompany;
  }
}
