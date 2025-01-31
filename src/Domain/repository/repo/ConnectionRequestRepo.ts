
import { ConnectionRequest } from "../../entities/UserConnections";

export interface ConnectionRequestRepository {
  findOneByUsers(fromUserId: string, toUserId: string): Promise<ConnectionRequest | null>;
  create(connectionRequest: Partial<ConnectionRequest>): Promise<ConnectionRequest>;
  updateStatus(id: string, status: 'pending' | 'accepted' | 'rejected'): Promise<ConnectionRequest>;
  delete(id: string): Promise<boolean>;
  findOne(id: string): Promise<ConnectionRequest | null>;
    update(connectionRequest: ConnectionRequest): Promise<ConnectionRequest>;
    findRequestsWithPagination(offset: number, limit: number, filter: object): Promise<{ pendingRequests: ConnectionRequest[]; totalRequests: number }>;
    getPendingRequestsCount(userId: string): Promise<number> 

  }
