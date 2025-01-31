import mongoose from 'mongoose';

export interface IConnectionRequest {
  _id: string;
  fromUser: mongoose.Types.ObjectId;
  toUser: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export class ConnectionRequest implements IConnectionRequest {
  _id: string;
  fromUser: mongoose.Types.ObjectId;
  toUser: mongoose.Types.ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<IConnectionRequest>) {
    this._id = data._id!;
    this.fromUser = data.fromUser!;
    this.toUser = data.toUser!;
    this.status = data.status || 'pending';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }


  acceptRequest() {
    if (this.status === 'pending') {
      this.status = 'accepted';
    }
  }


  rejectRequest() {
    if (this.status === 'pending') {
      this.status = 'rejected';
    }
  }

}

  export const normalizeRequest = (data: any): ConnectionRequest => {
    // console.log('Received company data:', data); 
    if (!data || !data._id) {
      throw new Error('Invalid data or missing _id');
    }
  
    return {
      ...data,
      _id: data._id.toString(), 
      fromUser : data.fromUser.toString(),
      toUser : data.toUser.toString()
    };
  };