import { IConnectionRequestDTO } from './../../../Application2/dto/connections/ConnectionDTO';
import { CustomError } from '../../../shared/error/customError';
import { STATUS_CODES } from '../../../shared/constants/statusCodes';
import { ConnectionRequestModel } from '../models/ConnectionRequestModel';
import { IConnectionRequestRepository } from '../../../Domain2/respositories/IConnectionRequestRepo';
import { IConnectionRequest } from '../../../Domain2/entities/UserConnections';
import { normalizeConnectionRequest } from '../../../shared/utils/Normalisation/nomaliseConnectionRequest';


export class ConnectionRequestRepository implements IConnectionRequestRepository {
  async findOneByUsers(
    fromUserId: string,
    toUserId: string
  ): Promise<IConnectionRequestDTO | null> {
    const connectionRequest = await ConnectionRequestModel.findOne({
      fromUser: fromUserId,
      toUser: toUserId,
    }).lean();
    return connectionRequest ? normalizeConnectionRequest(connectionRequest) : null;
  }

  async create(
    connectionRequest: Partial<IConnectionRequest>
  ): Promise<IConnectionRequestDTO> {
    const newConnectionRequest = new ConnectionRequestModel(connectionRequest);
    const savedRequest = await newConnectionRequest.save();
    return normalizeConnectionRequest(savedRequest);
  }

  async updateStatus(
    id: string,
    status: 'pending' | 'accepted' | 'rejected'
  ): Promise<IConnectionRequestDTO> {
    const updatedRequest = await ConnectionRequestModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!updatedRequest) {
      throw new CustomError(
        STATUS_CODES.NOT_FOUND,
        'Connection request not found'
      );
    }

    return normalizeConnectionRequest(updatedRequest);
  }

  async delete(id: string): Promise<boolean> {
    const result = await ConnectionRequestModel.findByIdAndDelete(id);
    return result ? true : false;
  }

  async findOne(id: string): Promise<IConnectionRequestDTO | null> {
    const connectionRequest = await ConnectionRequestModel.findById(id).lean();
    return connectionRequest ? normalizeConnectionRequest(connectionRequest) : null;
  }

  async update(
    connectionRequest: IConnectionRequest
  ): Promise<IConnectionRequestDTO> {
    const updatedConnectionRequest =
      await ConnectionRequestModel.findByIdAndUpdate(
        connectionRequest._id,
        connectionRequest,
        { new: true }
      )
        .lean()
        .exec();
    if (!updatedConnectionRequest) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, 'Connection Request found');
    }
    return normalizeConnectionRequest(updatedConnectionRequest);
  }

  async findRequestsWithPagination(
    offset: number,
    limit: number,
    filter: object
  ): Promise<{ pendingRequests: IConnectionRequestDTO[]; totalRequests: number }> {
    try {
      console.log(offset, filter, limit);
      const pendingRequests = await ConnectionRequestModel.find(filter)
        .populate(
          'fromUser',
          '_id userName tagLine email phone address profilePhoto'
        )
        .populate(
          'toUser',
          '_id userName email tagLine phone address profilePhoto'
        )
        .skip(offset)
        .limit(limit);

      const totalRequests = await ConnectionRequestModel.countDocuments(filter);
      console.log(totalRequests);

      console.log('Job applications in repo', pendingRequests);

      return {
        pendingRequests: pendingRequests.map(normalizeConnectionRequest),
        totalRequests,
      };
    } catch (err) {
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Failed to return data from repository'
      );
    }
  }

  async getPendingRequestsCount(userId: string): Promise<number> {
    try {
      const pendingRequests = await ConnectionRequestModel.countDocuments({
        toUser: userId,
        status: 'pending',
      });
      return pendingRequests;
    } catch (error) {
      throw new CustomError(
        STATUS_CODES.INTERNAL_SERVER_ERROR,
        'Failed to get pending requests count'
      );
    }
  }
}
