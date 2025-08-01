
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import mongoose  from 'mongoose';
import { MESSAGES } from '../../../shared/constants/messages';
import { IConnectionRequestRepository } from '../../../Domain2/respositories/IConnectionRequestRepo';
import { IUserRepository } from '../../../Domain2/respositories/IUserRepository';
import { IConnectionRequestDTO } from '../../dto/connections/ConnectionDTO';
import { User } from '../../../Domain2/entities/User';

export class ConnectionRequestUseCase {
  constructor(  
  private connectionRequestRepo: IConnectionRequestRepository,
  private userRepository: IUserRepository
) { }

  async createConnectionRequest(
    fromUser: string,
    toUser: string
  ): Promise<IConnectionRequestDTO> {
    const existingRequest = await this.connectionRequestRepo.findOneByUsers(
      fromUser,
      toUser
    );
    if (existingRequest) {
      throw new CustomError(
        STATUS_CODES.BAD_REQUEST,
       MESSAGES.REQUEST_EXISTS
      );
    }
    const fromUserObj = new mongoose.Types.ObjectId(fromUser);
    const toUserObj = new mongoose.Types.ObjectId(toUser);
    const newRequest = await this.connectionRequestRepo.create({
      fromUser: fromUserObj,
      toUser: toUserObj,
      status: 'pending',
    });
    return newRequest;
  }

  async getConnectionRequestById(id: string): Promise<IConnectionRequestDTO | null> {
    return this.connectionRequestRepo.findOne(id);
  }

  async getConnectionRequestForUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ pendingRequests: IConnectionRequestDTO[]; totalRequests: number }> {
    try {
      const offset = (page - 1) * limit;
      const filter = {
        toUser: userId,
        status: 'pending',
      };

      const { pendingRequests, totalRequests } =
        await this.connectionRequestRepo.findRequestsWithPagination(
          offset,
          limit,
          filter
        );

      return { pendingRequests, totalRequests };
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error while getting requests'
      );
    }
  }

  async getConnectionRequestSentByUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ pendingRequests: IConnectionRequestDTO[]; totalRequests: number }> {
    try {
      const offset = (page - 1) * limit;
      const filter = {
        fromUser: userId,
        status: 'pending',
      };

      const { pendingRequests, totalRequests } =
        await this.connectionRequestRepo.findRequestsWithPagination(
          offset,
          limit,
          filter
        );
      console.log('usecase', pendingRequests);
      return { pendingRequests, totalRequests };
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error while getting requests'
      );
    }
  }

  async getPendingRequestCountForUser(userId: string): Promise<number> {
    try {
      const pendingCount =
        await this.connectionRequestRepo.getPendingRequestsCount(userId);
      console.log(pendingCount);
      return pendingCount;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error while getting requests count'
      );
    }
  }

  //find all connection for user
  async findAllConnections(
    userId: string,
    page: number,
    limit: number,
    search: string | null
  ): Promise<{ connections: User[]; total: number }> {
    try {
      const offset = (page - 1) * limit;
      const { connections, total } = await this.userRepository.findConnections(
        userId,
        offset,
        limit,
        search
      );
      return { connections, total };
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error while getting connections'
      );
    }
  }

  //get recommendations
  async recommendationForUsers(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ users: User[]; total: number }> {
    try {
      const user = await this.userRepository.findById(userId);
      const offset = (page - 1) * limit;

      if (!user) {
        throw new CustomError(STATUS_CODES.NOT_FOUND, MESSAGES.USER_NOT_FOUND);
      }

      const filterCriteria: any = {
        _id: { $ne: userId },
        userRole: 'jobSeeker',
      };

      let keywords: string[] = [];
      if (user.tagLine) {
        const userTagline = user.tagLine.toLowerCase();
        keywords = userTagline.split(' ');
      }

      if (keywords.length > 0) {
        filterCriteria.tagLine = {
          $in: keywords.map((keyword) => new RegExp(keyword, 'i')),
        };
      }

      if (user.address) {
        const addressParts = user.address.split(/[\s,]+/);

        const addressFilter = addressParts.map((part) => {
          return { address: { $regex: new RegExp(part, 'i') } };
        });

        filterCriteria.$or = addressFilter;
      }

      const { users, total } = await this.userRepository.findUsers(
        offset,
        limit,
        filterCriteria
      );
      return { users, total };
    } catch (error) {
      console.error('Error fetching recommended users:', error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Error while fetching recommendations'
      );
    }
  }

  async acceptConnectionRequest(id: string): Promise<void> {


    console.log('request id' , id)
    const updatedRequest = await this.connectionRequestRepo.updateStatus(id,'accepted');
console.log('from user',updatedRequest.fromUser._id)
console.log("to user",updatedRequest.toUser)
    const fromUserString = updatedRequest.fromUser._id.toString();
    const toUserString = updatedRequest.toUser._id.toString();
    await Promise.all([
      this.userRepository.addConnection(fromUserString, toUserString),
      this.userRepository.addConnection(toUserString, fromUserString),
    ]);

    // return updatedRequest;
  }

  async rejectConnectionRequest(id: string): Promise<IConnectionRequestDTO> {
    return this.connectionRequestRepo.updateStatus(id, 'rejected');
  }

  async deleteConnectionRequest(id: string): Promise<boolean> {
    return this.connectionRequestRepo.delete(id);
  }

  async searchUsers({
    page = 1,
    limit = 10,
    searchTerm = '',
    userRole = '',
  }: {
    page?: number;
    limit?: number;
    searchTerm?: string;
    userRole?: string;
  }): Promise<User[]> {
    const offset = (page - 1) * limit;
    const filter: any = {
      ...(searchTerm && {
        $or: [
          { userName: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
          { phone: { $regex: searchTerm, $options: 'i' } },
        ],
      }),
      ...(userRole && { userRole }),
    };

    const allUsers = await this.userRepository.findUsersWithPagination(
      offset,
      limit,
      filter
    );
    return allUsers;
  }
}
