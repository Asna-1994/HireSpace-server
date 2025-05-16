import { IConnectionRequestDTO } from "../../Application2/dto/connections/ConnectionDTO";
import { IConnectionRequest } from "../entities/UserConnections";



export interface IConnectionRequestRepository {
  findOneByUsers(
    fromUserId: string,
    toUserId: string
  ): Promise<IConnectionRequestDTO | null>;
  create(
    connectionRequest: Partial<IConnectionRequest>
  ): Promise<IConnectionRequestDTO>;
  updateStatus(
    id: string,
    status: 'pending' | 'accepted' | 'rejected'
  ): Promise<IConnectionRequestDTO>;
  delete(id: string): Promise<boolean>;
  findOne(id: string): Promise<IConnectionRequestDTO | null>;
  update(connectionRequest: IConnectionRequest): Promise<IConnectionRequestDTO>;
  findRequestsWithPagination(
    offset: number,
    limit: number,
    filter: object
  ): Promise<{ pendingRequests: IConnectionRequestDTO[]; totalRequests: number }>;
  getPendingRequestsCount(userId: string): Promise<number>;
}
