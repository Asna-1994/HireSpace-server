import mongoose from "mongoose";
import { IConnectionRequestDTO } from "../../../Application2/dto/connections/ConnectionDTO";
import { IConnectionRequest } from "../../../Domain2/entities/UserConnections";




export function normalizeConnectionRequest(
  doc: any
): IConnectionRequestDTO {
  return {
    _id: doc._id?.toString() || '',
    fromUser: typeof doc.fromUser === 'object' && doc.fromUser !== null
      ? {
          _id: doc.fromUser._id?.toString() || '',
          userName: doc.fromUser.userName || '',
          email: doc.fromUser.email || '',
          profilePhoto: doc.fromUser.profilePhoto || '',
        }
      : {
          _id: doc.fromUser?.toString() || '',
          userName: '',
          email: '',
        },
    toUser: typeof doc.toUser === 'object' && doc.toUser !== null
      ? {
          _id: doc.toUser._id?.toString() || '',
          userName: doc.toUser.userName || '',
          email: doc.toUser.email || '',
          phone: doc.toUser.phone || '',
          address: doc.toUser.address || '',
          profilePhoto: doc.toUser.profilePhoto || '',
          tagLine: doc.toUser.tagLine || '',
        }
      : {
          _id: doc.toUser?.toString() || '',
          userName: '',
          email: '',
        },
    status: doc.status as 'pending' | 'accepted' | 'rejected',
    createdAt: doc.createdAt || new Date(0),
    updatedAt: doc.updatedAt || new Date(0),
  };
}


export function denormalizeConnectionRequest(
  dto: IConnectionRequestDTO
): IConnectionRequest {
  return {
    _id: new mongoose.Types.ObjectId(dto._id),
    fromUser: new mongoose.Types.ObjectId(dto.fromUser._id),
    toUser: new mongoose.Types.ObjectId(dto.toUser._id),
    status: dto.status,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}