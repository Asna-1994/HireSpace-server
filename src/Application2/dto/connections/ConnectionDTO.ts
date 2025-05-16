import { imageObject } from "../../../Domain2/entities/User";

export interface IConnectionRequestDTO {
  _id: string;
  fromUser: {
    _id: string;
    userName: string;
    email: string;
        phone?: string;
    address?: string;
    profilePhoto?: imageObject;
     tagLine?: string;
  };
  toUser: {
    _id: string;
    userName: string;
    email: string;
    phone?: string;
    address?: string;
    profilePhoto?: imageObject; 
    tagLine?: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
