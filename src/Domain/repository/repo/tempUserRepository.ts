import { TempUser } from "../../entities/tempUser";

export interface TempUserRepository {
  create(tempUser: TempUser): Promise<TempUser>;
  findByEmail(email: string): Promise<TempUser | null>;
  deleteByEmail(email: string): Promise<void>;
  // save(email : string, otp:string, otpExpiry : Date): Promise<TempUser | null>;
  updateOne(tempUser: TempUser): Promise<TempUser>;
}
