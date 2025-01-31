import { ConnectionRequestRepository } from "../repo/ConnectionRequestRepo";
import { ConnectionRequestModel } from "../../../Infrastructure/models/ConnectionRequestModel";
import { ConnectionRequest, normalizeRequest } from "../../entities/UserConnections";
import { CustomError } from "../../../shared/error/customError";
import { STATUS_CODES } from "../../../shared/constants/statusCodes";

export class ConnectionRequestImpl implements ConnectionRequestRepository {


  async findOneByUsers(fromUserId: string, toUserId: string): Promise<ConnectionRequest | null> {
    const connectionRequest = await ConnectionRequestModel.findOne({ fromUser: fromUserId, toUser: toUserId }).lean();
    return connectionRequest ? normalizeRequest(connectionRequest) : null;
  }

  
  async create(connectionRequest: Partial<ConnectionRequest>): Promise<ConnectionRequest> {
    const newConnectionRequest = new ConnectionRequestModel(connectionRequest);
    const savedRequest = await newConnectionRequest.save();
    return normalizeRequest(savedRequest);
  }

  
  async updateStatus(id: string, status: 'pending' | 'accepted' | 'rejected'): Promise<ConnectionRequest> {
    const updatedRequest = await ConnectionRequestModel.findByIdAndUpdate(id, { status }, { new: true }).lean();
    
    if (!updatedRequest) {
      throw new CustomError(STATUS_CODES.NOT_FOUND, "Connection request not found");
    }
    
    return normalizeRequest(updatedRequest);
  }


  async delete(id: string): Promise<boolean> {
    const result = await ConnectionRequestModel.findByIdAndDelete(id);
    return result ? true : false;
  }


  async findOne(id: string): Promise<ConnectionRequest | null> {
    const connectionRequest = await ConnectionRequestModel.findById(id).lean();
    return connectionRequest ? normalizeRequest(connectionRequest) : null;
  }


    async update(connectionRequest: ConnectionRequest): Promise<ConnectionRequest> {
      const updatedConnectionRequest = await ConnectionRequestModel.findByIdAndUpdate(
        connectionRequest._id,
        connectionRequest,
        { new: true }
      )
        .lean()
        .exec();
      if (!updatedConnectionRequest) {
        throw new CustomError(STATUS_CODES.NOT_FOUND, "Connection Request found");
      }
      return normalizeRequest(updatedConnectionRequest);
    }

    async findRequestsWithPagination(offset: number, limit: number, filter: object): Promise<{ pendingRequests: ConnectionRequest[]; totalRequests: number }> {
        try {
      console.log(offset, filter, limit)
            const pendingRequests = await ConnectionRequestModel.find(filter)
                .populate('fromUser', '_id userName tagLine email phone address profilePhoto') 
                .populate('toUser', '_id userName email tagLine phone address profilePhoto')
                .skip(offset)
                .limit(limit)
               
            
       
            const totalRequests = await ConnectionRequestModel.countDocuments(filter);
            console.log(totalRequests)
    
            console.log("Job applications in repo", pendingRequests);
            
            return { pendingRequests: pendingRequests.map(normalizeRequest)  , totalRequests};
        } catch (err) {
            throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR, "Failed to return data from repository");
        }
    }


    async getPendingRequestsCount(userId: string): Promise<number> {
      try {
        const pendingRequests = await ConnectionRequestModel.countDocuments({
          toUser: userId,
          status: 'pending'
        });
        return pendingRequests;
      } catch (error) {
        throw new CustomError(STATUS_CODES.INTERNAL_SERVER_ERROR,'Failed to get pending requests count',);
      }
    }
}
