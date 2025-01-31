import { UserRepository } from "../repo/userRepository";
import { UserModel } from "../../../Infrastructure/models/UserModel";
import { User } from "../../entities/User";
import { CustomError } from "../../../shared/error/customError";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";
import mongoose from "mongoose";



export class UserRepositoryImpl implements UserRepository {

async create(userData: Partial<User>, options?: { session?: mongoose.ClientSession }): Promise<User> {
  const newUser = new UserModel(userData);
  const savedUser = options?.session
    ? await newUser.save({ session: options.session })
    : await newUser.save();

  return savedUser.toObject() as User;
}




  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email }).lean().exec();
    return user 
  }
  async findById(userId: string): Promise<User | null> {
    const user = await UserModel.findById(userId).lean().exec();
    return user 
  }

  async findMembers(filter: object = {}, projection: string = ''): Promise<User[] | null> {
    const user = await UserModel.find(filter, projection).lean().exec();
    console.log("fetched user : ",user)
    return user;
  }


  async findByGoogleId(googleId: string): Promise<User | null> {
    const user = await UserModel.findOne({ googleId }).lean().exec();
    return user 
  }

  async update(user: User, session?: mongoose.ClientSession): Promise<User> {
    const updatedUser = await UserModel.findByIdAndUpdate(user._id, user, { 
      new: true, 
      session,  
    }).lean().exec();

    if (!updatedUser) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, 'User not found');
    }
    return updatedUser as User;
  }

  async delete(userId: string): Promise<void> {
    await UserModel.findByIdAndDelete(userId).exec();
  }

  async findUsersWithActiveSubscriptions(): Promise<User[]> {
    const users  = await UserModel.find({
      'appPlan.planType': { $ne: 'basic' },
      'appPlan.startDate': { $ne: null },
      'appPlan.endDate': { $ne: null },
    });
    return users
  }
  

  async findPremiumUsers(offset:number , limit : number,filter : object): Promise<{users : User[], total : number}> {
  const [users, total] = await Promise.all([
    UserModel.find(filter)
      .skip(offset)
      .limit(limit)
      .populate({
        path: 'appPlan.subscriptionId', 
        populate: {
          path: 'planId',            
          model: 'PlanModel',          
        },
      })
      .lean(), 
    UserModel.countDocuments(filter), 
  ]);

  return { users, total}

}





  async findUsersWithPagination(offset: number, limit: number,   filter: object): Promise<User[]> {
    return await UserModel.find(filter).skip(offset).limit(limit).lean().exec();
  }


    async blockOrUnblock( entityId : string, action : string) : Promise<User>{
        let blockedUser
        if(action==='block'){
            blockedUser = await UserModel.findByIdAndUpdate(entityId , {isBlocked : true}, {new : true})
        }else{
             blockedUser = await UserModel.findByIdAndUpdate(entityId , {isBlocked : false}, {new : true})
        }
     
      return blockedUser as User
    }
  async find(filter : object): Promise<User[]> {
    const users= await UserModel.find(filter)
    return users
  }

    async addConnection(userId: string, connectionId: string): Promise<User | null> {
    const updatedUser =   await UserModel.findByIdAndUpdate(userId, {
        $addToSet: { connections: connectionId }, 
      });
      return updatedUser
    }

  //   async findConnections(userId: string, offset: number, limit: number): Promise<{ connections: User[], total: number }> {
  //     const userWithConnections = await UserModel.findById(userId)
  //         .populate({
  //             path: 'connections',
  //             select: 'userName email profilePhoto tagLine',
  //             options: { skip: offset, limit: limit },
  //         })
  //         .exec();
  
  //     if (!userWithConnections) {
  //         throw new CustomError(STATUS_CODES.NOT_FOUND, "No user found with ID");
  //     }
  
  //     const totalConnections = await UserModel.findById(userId).select('connections').exec();
  //     const total = totalConnections?.connections.length || 0;
  
  //     return {
  //         connections: userWithConnections.connections as unknown as User[],
  //         total,
  //     };
  // }
  async findConnections(
    userId: string, 
    offset: number, 
    limit: number, 
    search: string | null
  ): Promise<{ connections: User[]; total: number }> {
  
    const userWithConnections = await UserModel.findById(userId)
      .populate({
        path: 'connections',
        match: search
          ? {
              $or: [
                { userName: { $regex: search, $options: 'i' } }, 
                { email: { $regex: search, $options: 'i' } },    
              ],
            }
          : undefined, 
        select: 'userName email profilePhoto tagLine',
        options: { skip: offset, limit: limit },
      })
      .exec();
  
    if (!userWithConnections) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, 'No user found with ID');
    }
  

    const totalConnections = await UserModel.findById(userId)
      .populate({
        path: 'connections',
        match: search
          ? {
              $or: [
                { userName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
              ],
            }
          : undefined,
        select: '_id', 
      })
      .exec();
  
    const total = totalConnections?.connections.length || 0;
  
    return {
      connections: userWithConnections.connections as unknown as User[],
      total,
    };
  }
  
  async countTotal(dateQuery: any = {}): Promise<number> {
    return await UserModel.countDocuments(dateQuery);
}

async countPremium(dateQuery: any = {}): Promise<number> {
  return await UserModel.countDocuments({ ...dateQuery, isPremium: true });
}


  async findUsers(offset: number, limit: number, filter: object): Promise<{ users: User[], total: number }> {
    const [users, total] = await Promise.all([
      UserModel.find(filter).skip(offset).limit(limit).lean().exec(),
      UserModel.countDocuments(filter),
    ]);
  
    return { users: users, total };

  }



  
}