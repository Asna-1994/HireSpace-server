import { ITempCompany } from "../entities/TempCompany";


export interface ITempCompanyRepository {
  create(tempCompany: ITempCompany): Promise<ITempCompany>;
  findByEmail(email: string): Promise<ITempCompany | null>;
  deleteByEmail(email: string): Promise<void>;
  // save(email : string, otp:string, otpExpiry : Date): Promise<ITempCompany | null>;
  updateOne(tempCompany: ITempCompany): Promise<ITempCompany>;
}
