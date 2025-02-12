import { TempCompany } from "../../entities/tempCompany";

export interface TempCompanyRepository {
  create(tempCompany: TempCompany): Promise<TempCompany>;
  findByEmail(email: string): Promise<TempCompany | null>;
  deleteByEmail(email: string): Promise<void>;
  // save(email : string, otp:string, otpExpiry : Date): Promise<TempCompany | null>;
  updateOne(tempCompany: TempCompany): Promise<TempCompany>;
}
