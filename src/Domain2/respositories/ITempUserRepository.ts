import { ITempUser } from "../entities/TempUser";


export interface ITempUserRepository {
  create(tempUser: ITempUser): Promise<ITempUser>;
  findByEmail(email: string): Promise<ITempUser | null>;
  deleteByEmail(email: string): Promise<void>;
  // save(email : string, otp:string, otpExpiry : Date): Promise<ITempUser | null>;
  updateOne(tempUser: ITempUser): Promise<ITempUser>;
}
