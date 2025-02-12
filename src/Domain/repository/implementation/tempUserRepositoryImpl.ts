import { TempUserRepository } from "../repo/tempUserRepository";
import { TempUserModel } from "../../../Infrastructure/models/tempUserModel";
import { TempUser } from "../../entities/tempUser";
import { CustomError } from "../../../shared/error/customError";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";

export class TempUserRepositoryImpl implements TempUserRepository {
  async create(tempUser: TempUser): Promise<TempUser> {
    const newTempUser = new TempUserModel(tempUser);
    await newTempUser.save();
    return newTempUser;
  }

  async findByEmail(email: string): Promise<TempUser | null> {
    const user = await TempUserModel.findOne({ email }).exec();
    return user ? user : null;
  }

  async deleteByEmail(email: string): Promise<void> {
    await TempUserModel.deleteMany({ email }).exec();
  }

  async updateOne(user: TempUser): Promise<TempUser> {
    const updatedUser = await TempUserModel.findOneAndUpdate(
      { email: user.email },
      user,
      { new: true },
    )
      .lean()
      .exec();
    if (!updatedUser) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, "User not found");
    }
    return updatedUser;
  }
}
