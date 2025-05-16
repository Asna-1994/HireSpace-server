import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { ITempUserRepository } from '../../../Domain2/respositories/ITempUserRepository';
import { ITempUser } from '../../../Domain2/entities/TempUser';
import { TempUserModel } from '../models/TempUserModel';

export class TempUserRepository implements ITempUserRepository{
  async create(tempUser: ITempUser): Promise<ITempUser> {
    const newTempUser = new TempUserModel(tempUser);
    await newTempUser.save();
    return newTempUser;
  }

  async findByEmail(email: string): Promise<ITempUser | null> {
    const user = await TempUserModel.findOne({ email }).exec();
    return user ? user : null;
  }

  async deleteByEmail(email: string): Promise<void> {
    await TempUserModel.deleteMany({ email }).exec();
  }

  async updateOne(user: ITempUser): Promise<ITempUser> {
    const updatedUser = await TempUserModel.findOneAndUpdate(
      { email: user.email },
      user,
      { new: true }
    )
      .lean()
      .exec();
    if (!updatedUser) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, 'User not found');
    }
    return updatedUser;
  }
}
